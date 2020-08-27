import * as ts from 'typescript';
import * as path from 'path';
import { readFileSync, existsSync } from 'fs';
import { AstBlock } from './ast-block';
import { AstType } from './ast-type';
import { AstKeywordType } from './ast-keyword-type';
import { AstLiteralType } from './ast-literal-type';
import { AstTypeLiteralType } from './ast-type-literal-type';
import { AstReferenceType } from './ast-reference-type';
import { AstUnionType } from './ast-union-type';
import {
  AstBooleanLiteralValue,
  AstLiteralValue,
  AstNumericLiteralValue,
  AstStringLiteralValue,
} from './ast-literal-value';
import { AstObjectValue } from './ast-object-value';
import { AstKeywordValue } from './ast-keyword-value';
import { AstValue } from './ast-value';
import {
  BindingPattern, EntityName,
  Expression,
  Identifier,
  ModifiersArray,
  PropertyName,
  QualifiedName,
  SyntaxKind, TypeNode, Node,
} from 'typescript';
import { AstArrayType } from './ast-array-type';
import { AstVariableDeclaration } from './ast-variable-declaration';
import { AstArrayValue } from './ast-array-value';
import { AstNewExpression } from './ast-new-expression';
import { AstCallExpression } from './ast-call-expression';
import { AstPropertyAccessExpression } from './ast-property-access-expression';
import { AstSpreadElement } from './ast-spread-element';
import { AstRegularExpressionLiteral } from './ast-regular-expression-literal';

export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.TypeLiteral,
): ts.TypeLiteralNode | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.SpreadElement,
): ts.SpreadElement | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.TypeAliasDeclaration,
): ts.TypeAliasDeclaration | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.RegularExpressionLiteral,
): ts.RegularExpressionLiteral | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.ExportDeclaration,
): ts.ExportDeclaration | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.EnumDeclaration,
): ts.EnumDeclaration | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.TrueKeyword,
): ts.BooleanLiteral | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.FalseKeyword,
): ts.BooleanLiteral | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.NullKeyword,
): ts.KeywordTypeNode | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.UndefinedKeyword,
): ts.KeywordTypeNode | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.SpreadAssignment,
): ts.SpreadAssignment | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.ShorthandPropertyAssignment,
): ts.ShorthandPropertyAssignment | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.NamedImports,
): ts.NamedImports | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.NamespaceImport,
): ts.NamespaceImport | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.ClassDeclaration,
): ts.ClassDeclaration | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.VariableStatement,
): ts.VariableStatement | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.FunctionDeclaration,
): ts.FunctionDeclaration | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.MethodDeclaration,
): ts.MethodDeclaration | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.PropertyAssignment,
): ts.PropertyAssignment | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.NamedExports,
): ts.NamedExports | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.LiteralType,
): ts.LiteralTypeNode | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.StringLiteral,
): ts.StringLiteral | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.NumericLiteral,
): ts.NumericLiteral | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.NumericLiteral,
): ts.NumericLiteral | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.PropertySignature,
): ts.PropertySignature | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.TypeReference,
): ts.TypeReferenceNode | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.ArrayType,
): ts.ArrayTypeNode | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.UnionType,
): ts.UnionTypeNode | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.NewExpression,
): ts.NewExpression | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.NamespaceImport,
): ts.NamespaceImport | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.PropertyDeclaration,
): ts.PropertyDeclaration | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.ObjectLiteralExpression,
): ts.ObjectLiteralExpression | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.ExpressionStatement,
): ts.ExpressionStatement | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.ImportDeclaration,
): ts.ImportDeclaration | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.ExportAssignment,
): ts.ExportAssignment | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.Identifier,
): ts.Identifier | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.PropertyAccessExpression,
): ts.PropertyAccessExpression | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.CallExpression,
): ts.CallExpression | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.NamedImports,
): ts.NamedImports | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.NewExpression,
): ts.NewExpression | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.ArrayLiteralExpression,
): ts.ArrayLiteralExpression | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.StringLiteral,
): ts.StringLiteral | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.BooleanKeyword,
): ts.BooleanLiteral | null;
export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind,
): ts.Node | null {
  if (!node) {
    return null;
  }

  if (node.kind === kind) {
    return node;
  }
  return null;
}

export function getBooleanValue(value: AstValue): boolean {
  if (value instanceof AstLiteralValue) {
    const booleanValue = value.value;
    if (typeof booleanValue === 'boolean') {
      return booleanValue;
    }
  }

  throw new AstError(value.node, 'get boolean value');
}

export function getIdentifierName(identifier: ts.PrivateIdentifier | ts.BindingName | ts.StringLiteral | ts.NumericLiteral | ts.ComputedPropertyName | ts.Expression | ts.QualifiedName) {
  if (identifier.kind === ts.SyntaxKind.Identifier) {
    const identfier = <ts.Identifier>identifier;
    return identfier.text;
  }

  if (identifier.kind === ts.SyntaxKind.PrivateIdentifier) {
    const identfier = <ts.PrivateIdentifier>identifier;
    return identfier.text;
  }

  if (identifier.kind === ts.SyntaxKind.StringLiteral) {
    const stringLiteral = <ts.StringLiteral>identifier;
    return stringLiteral.text;
  }

  if (identifier.kind === ts.SyntaxKind.NumericLiteral) {
    const stringLiteral = <ts.NumericLiteral>identifier;
    return stringLiteral.text;
  }

  throw new AstError(identifier, 'get name');
}

export function parseSourceFile(fileName: string) {
  let filepath = fileName.endsWith('.ts') ? fileName : `${fileName}.ts`;

  if (!existsSync(filepath)) {
    filepath = path.join(fileName, 'index.ts');
    if (!existsSync(filepath)) {
      throw new Error(`unable to find source file ${fileName}`);
    }
  }

  return ts.createSourceFile(
    filepath,
    readFileSync(filepath).toString(),
    ts.ScriptTarget.ES2015,
    true,
  );
}

export function getName(identifier: Identifier | Expression | BindingPattern | EntityName | PropertyName | QualifiedName | string, nodeType: string) {
  if (typeof identifier === 'string') {
    return identifier;
  }

  const identifierNode = isKind(identifier, SyntaxKind.Identifier);
  if (identifierNode) {
    return identifierNode.getText();
  }

  //TODO binding pattern + property name + qualifiedname
  throw new AstError(identifier, `unable to parse name of ${nodeType}`);
}

export function hasModifier(modifiers: ModifiersArray | undefined, kind: SyntaxKind): boolean {
  return modifiers !== undefined && modifiers.some(m => m.kind === kind);
}

export function getType(block: AstBlock, node: TypeNode | undefined): AstType | null
export function getType(block: AstBlock, node: TypeNode): AstType
export function getType(block: AstBlock, node: TypeNode | undefined): AstType | null {
  if (!node) {
    return null;
  }

  if (node.kind === SyntaxKind.AnyKeyword || node.kind === SyntaxKind.UnknownKeyword ||
    node.kind === SyntaxKind.NumberKeyword || node.kind === SyntaxKind.BigIntKeyword ||
    node.kind === SyntaxKind.ObjectKeyword || node.kind === SyntaxKind.BooleanKeyword ||
    node.kind === SyntaxKind.StringKeyword || node.kind === SyntaxKind.SymbolKeyword ||
    node.kind === SyntaxKind.ThisKeyword || node.kind === SyntaxKind.VoidKeyword ||
    node.kind === SyntaxKind.UndefinedKeyword || node.kind === SyntaxKind.NullKeyword ||
    node.kind === SyntaxKind.NeverKeyword) {
    return new AstKeywordType(node as any);
  }

  const literalType = isKind(node, SyntaxKind.LiteralType);
  if (literalType) {
    return new AstLiteralType(literalType);
  }

  const typeLiteral = isKind(node, SyntaxKind.TypeLiteral);
  if (typeLiteral) {
    return new AstTypeLiteralType(block, typeLiteral);
  }

  const typeRef = isKind(node, SyntaxKind.TypeReference);
  if (typeRef) {
    return new AstReferenceType(block, typeRef);
  }

  const arrayType = isKind(node, SyntaxKind.ArrayType);
  if (arrayType) {
    return new AstArrayType(block, arrayType);
  }

  const unionType = isKind(node, SyntaxKind.UnionType);
  if (unionType) {
    return new AstUnionType(block, unionType);
  }

  throw new AstError(node, 'get type');
}

export function getTypeFromValue(value: AstValue): AstType | null {
  if (value instanceof AstArrayValue) {
    //return value.type;
  } else if (value instanceof AstLiteralValue) {
    return value.type;
  } else if (value instanceof AstObjectValue) {

  }

  return null;
}

export function getValueFromExpression(block: AstBlock, expression: Expression): AstValue
export function getValueFromExpression(block: AstBlock, expression: Expression | undefined): AstValue | null
export function getValueFromExpression(block: AstBlock, expression: Expression | undefined): AstValue | null {
  if (expression === undefined) {
    return null;
  }


  const numericLiteral = isKind(expression, SyntaxKind.NumericLiteral);
  if (numericLiteral) {
    return new AstNumericLiteralValue(numericLiteral);
  }

  const stringLiteral = isKind(expression, SyntaxKind.StringLiteral);
  if (stringLiteral) {
    return new AstStringLiteralValue(stringLiteral);
  }

  const objectLiteral = isKind(expression, SyntaxKind.ObjectLiteralExpression);
  if (objectLiteral) {
    return new AstObjectValue(block, objectLiteral);
  }

  const newExpression = isKind(expression, SyntaxKind.NewExpression);
  if (newExpression) {
    return new AstNewExpression(block, newExpression);
  }

  const trueKeyword = isKind(expression, SyntaxKind.TrueKeyword);
  if (trueKeyword) {
    return new AstBooleanLiteralValue(trueKeyword);
  }
  const falseKeyword = isKind(expression, SyntaxKind.FalseKeyword);
  if (falseKeyword) {
    return new AstBooleanLiteralValue(falseKeyword);
  }
  const nullKeyword = isKind(expression, SyntaxKind.NullKeyword);
  if (nullKeyword) {
    return new AstKeywordValue(nullKeyword);
  }
  const undefinedKeyword = isKind(expression, SyntaxKind.UndefinedKeyword);
  if (undefinedKeyword) {
    return new AstKeywordValue(undefinedKeyword);
  }

  const array = isKind(expression, SyntaxKind.ArrayLiteralExpression);
  if (array) {
    return new AstArrayValue(block, array);
  }

  const identifierNode = isKind(expression, SyntaxKind.Identifier);
  if (identifierNode) {
    return block.getValue(identifierNode);
  }

  const callExpression = isKind(expression, SyntaxKind.CallExpression);
  if (callExpression) {
    return new AstCallExpression(block, callExpression);
  }

  const propertyAccessExpression = isKind(expression, SyntaxKind.PropertyAccessExpression);
  if (propertyAccessExpression) {
    return new AstPropertyAccessExpression(block, propertyAccessExpression);
  }

  const spreadElement = isKind(expression, SyntaxKind.SpreadElement);
  if (spreadElement) {
    return new AstSpreadElement(block, spreadElement);
  }

  const regularExpressionLiteral = isKind(expression, SyntaxKind.RegularExpressionLiteral);
  if (regularExpressionLiteral) {
    return new AstRegularExpressionLiteral(block, regularExpressionLiteral);
  }

  //TODO
  throw new AstError(expression, 'value from expression');
}

export function getTypeFromTypeOrExpression(block: AstBlock, typeNode: TypeNode | undefined, expression: Expression | undefined): AstType | null {
  if (typeNode) {
    const type = getType(block, typeNode);
    if (type) {
      return type;
    }
  }

  if (expression) {
    const value = getValueFromExpression(block, expression);
    if (value) {
      if (value instanceof AstLiteralValue) {
        return value.type;
      } else if (value instanceof AstPropertyAccessExpression) {
        return getTypeFromValue(value.value);
      } else if (value instanceof AstPropertyAccessExpression) {
        return getTypeFromValue(value.value);
      } else if (value instanceof AstNewExpression) {
        return value.type;
      } else {
        //TODO
        console.log('unknown');
      }
    }
  }
  return null;
}

export function isSameType(first: AstType, second: AstType): boolean {
  if (first instanceof AstKeywordType && second instanceof AstKeywordType) {
    return first.equals(second);
  }

  throw new Error('type is not comparable');
}

export function getStringOrNull(value: AstValue | null | undefined): string | null {
  if (!value) {
    return null;
  }

  return getStringValue(value);
}

export function getStringValue(value: AstValue): string {
  if (value instanceof AstLiteralValue) {
    const stringValue = value.value;
    if (typeof stringValue === 'string') {
      return stringValue;
    }
  }

  throw new AstError(value.node, 'get string value');
}

export function getArrayValue<T>(value: AstValue, fn: (element: AstValue) => T): T[] {
  const array: T[] = [];
  if (value instanceof AstArrayValue) {
    for (const element of value.elements) {
      array.push(fn(element));
    }
  }
  return array;
}

export function getObjectValue(value: AstValue): AstObjectValue {
  if (value instanceof AstObjectValue) {
    return value;
  }
  if (value instanceof AstVariableDeclaration) {
    const variableValue = value.value;
    if (variableValue instanceof AstObjectValue) {
      return variableValue;
    }
  }

  throw new AstError(value.node, 'unknown object value');
}

export class AstError extends Error {
  constructor(private node: Node, private reason: string) {
    super();
  }

  get message(): string {
    const sourceFile = this.node.getSourceFile();
    if (sourceFile) {
      const code = this.node.getFullText();
      const pos = sourceFile.getLineAndCharacterOfPosition(this.node.getStart());
      return `${this.reason}: ${code} [${sourceFile.fileName}, line ${pos.line}, char ${pos.character}]`;
    } else {
      return this.reason;
    }
  }
}
