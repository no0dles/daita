import * as ts from 'typescript';
import { getIdentifierName, isKind } from './utils';
import { AstClassDeclaration } from './ast-class-declaration';
import { AstSourceFile } from './ast-source-file';

export type AstType =
  AstUnionType
  | AstArrayType
  | AstStringType
  | AstBooleanType
  | AstNumberType
  | AstAnyType
  | AstNullType
  | AstTypeLiteralType
  | AstReferenceType
  | AstUndefinedType;

export interface AstUnionType {
  kind: 'union';
  types: AstType[];
  allowUndefined: boolean;
}

export interface AstArrayType {
  kind: 'array';
  elementType: AstType;
  allowUndefined: boolean;
}

export interface AstBooleanType {
  kind: 'boolean';
  allowUndefined: boolean;
}

export interface AstStringType {
  kind: 'string';
  allowUndefined: boolean;
}

export interface AstNumberType {
  kind: 'number';
  allowUndefined: boolean;
}

export interface AstNullType {
  kind: 'null';
  allowUndefined: boolean;
}

export interface AstUndefinedType {
  kind: 'undefined';
  allowUndefined: boolean;
}

export interface AstAnyType {
  kind: 'any';
  allowUndefined: boolean;
}

export interface AstTypeLiteralType {
  kind: 'type_literal';
  members: { name: string; type: AstType }[];
  allowUndefined: boolean;
}

export interface AstReferenceType {
  kind: 'reference';
  reference: AstClassDeclaration | null; // TODO interface support
  referenceName: string;
  allowUndefined: boolean;
}

export function parsePropertyType(sourceFile: AstSourceFile, propertyDeclaration: ts.PropertyDeclaration): AstType | null {
  if (!propertyDeclaration.type) {
    return null;
  }
  return parseType(sourceFile, propertyDeclaration.type, !!propertyDeclaration.questionToken);
}

export function parseType(sourceFile: AstSourceFile, typeNode: ts.TypeNode, allowUndefined: boolean): AstType {
  if (typeNode.kind === ts.SyntaxKind.StringKeyword) {
    return { kind: 'string', allowUndefined };
  }
  if (typeNode.kind === ts.SyntaxKind.NumberKeyword) {
    return { kind: 'number', allowUndefined };
  }
  if (typeNode.kind === ts.SyntaxKind.AnyKeyword) {
    return { kind: 'any', allowUndefined };
  }
  if (typeNode.kind === ts.SyntaxKind.UndefinedKeyword) {
    return { kind: 'undefined', allowUndefined };
  }
  if (typeNode.kind === ts.SyntaxKind.NullKeyword) {
    return { kind: 'null', allowUndefined };
  }
  if (typeNode.kind === ts.SyntaxKind.BooleanKeyword) {
    return { kind: 'boolean', allowUndefined };
  }
  const union = isKind(typeNode, ts.SyntaxKind.UnionType);
  if (union) {
    return { kind: 'union', allowUndefined, types: union.types.map(type => parseType(sourceFile, type, false)) };
  }
  const array = isKind(typeNode, ts.SyntaxKind.ArrayType);
  if (array) {
    return { kind: 'array', allowUndefined, elementType: parseType(sourceFile, array.elementType, false) };
  }
  const literalType = isKind(typeNode, ts.SyntaxKind.LiteralType);
  if (literalType) {
    if (literalType.isNumberLiteral()) {
      return { kind: 'number', allowUndefined };
    } else if (literalType.isStringLiteral()) {
      return { kind: 'string', allowUndefined };
    }
  }

  const typeLiteral = isKind(typeNode, ts.SyntaxKind.TypeLiteral);
  if (typeLiteral) {
    return {
      kind: 'type_literal',
      allowUndefined,
      members: typeLiteral.members.map(member => {
        if (!member.name) {
          throw new Error('missing member name');
        }
        const propertySignature = isKind(member, ts.SyntaxKind.PropertySignature);
        if (!propertySignature) {
          throw new Error('not property signature');
        }
        if (!propertySignature.type) {
          throw new Error('not property signature with no type');
        }
        return {
          name: getIdentifierName(member.name),
          type: parseType(sourceFile, propertySignature.type, !!member.questionToken),
        };
      }),
    };
  }

  const reference = isKind(typeNode, ts.SyntaxKind.TypeReference);
  if (reference) {
    const referenceName = getIdentifierName(reference.typeName);
    const referenceClassDeclaration = sourceFile.getClassDeclaration(referenceName, { includeImport: true });
    return {
      kind: 'reference',
      allowUndefined,
      referenceName,
      reference: referenceClassDeclaration,
    };
  }

  throw new Error('unknown type');
}
