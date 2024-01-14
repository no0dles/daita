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
  BindingPattern,
  EntityName,
  Expression,
  Identifier,
  ModifiersArray,
  PropertyName,
  QualifiedName,
  SyntaxKind,
  TypeNode,
  Node,
  RegularExpressionLiteral,
  TypeAliasDeclaration,
  EnumDeclaration,
  ExportDeclaration,
  SpreadElement,
  BooleanLiteral,
  TypeLiteralNode,
  NullLiteral,
  SpreadAssignment,
  KeywordTypeNode,
  NamedImports,
  NamespaceImport,
  ClassDeclaration,
  VariableStatement,
  ShorthandPropertyAssignment,
  MethodDeclaration,
  PropertyAssignment,
  NamedExports,
  LiteralTypeNode,
  StringLiteral,
  NumericLiteral,
  PropertySignature,
  TypeReferenceNode,
  ArrayTypeNode,
  UnionTypeNode,
  NewExpression,
  FunctionDeclaration,
  ExpressionStatement,
  ImportDeclaration,
  ObjectLiteralExpression,
  ExportAssignment,
  PropertyDeclaration,
  CallExpression,
  PropertyAccessExpression,
  ArrayLiteralExpression,
  PrivateIdentifier,
  BindingName,
  ComputedPropertyName,
  createSourceFile,
  ScriptTarget, NodeArray, ModifierLike,
} from 'typescript';
import { AstArrayType } from './ast-array-type';
import { AstVariableDeclaration } from './ast-variable-declaration';
import { AstArrayValue } from './ast-array-value';
import { AstNewExpression } from './ast-new-expression';
import { AstCallExpression } from './ast-call-expression';
import { AstPropertyAccessExpression } from './ast-property-access-expression';
import { AstSpreadElement } from './ast-spread-element';
import { AstRegularExpressionLiteral } from './ast-regular-expression-literal';

export function isKind(node: Node | undefined, kind: SyntaxKind.TypeLiteral): TypeLiteralNode | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.SpreadElement): SpreadElement | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.TypeAliasDeclaration): TypeAliasDeclaration | null;
export function isKind(
  node: Node | undefined,
  kind: SyntaxKind.RegularExpressionLiteral,
): RegularExpressionLiteral | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.ExportDeclaration): ExportDeclaration | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.EnumDeclaration): EnumDeclaration | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.TrueKeyword): BooleanLiteral | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.FalseKeyword): BooleanLiteral | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.NullKeyword): NullLiteral | null;
export function isKind(
  node: Node | undefined,
  kind: SyntaxKind.UndefinedKeyword,
): KeywordTypeNode<SyntaxKind.UndefinedKeyword> | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.SpreadAssignment): SpreadAssignment | null;
export function isKind(
  node: Node | undefined,
  kind: SyntaxKind.ShorthandPropertyAssignment,
): ShorthandPropertyAssignment | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.NamedImports): NamedImports | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.NamespaceImport): NamespaceImport | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.ClassDeclaration): ClassDeclaration | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.VariableStatement): VariableStatement | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.FunctionDeclaration): FunctionDeclaration | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.MethodDeclaration): MethodDeclaration | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.PropertyAssignment): PropertyAssignment | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.NamedExports): NamedExports | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.LiteralType): LiteralTypeNode | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.StringLiteral): StringLiteral | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.NumericLiteral): NumericLiteral | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.NumericLiteral): NumericLiteral | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.PropertySignature): PropertySignature | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.TypeReference): TypeReferenceNode | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.ArrayType): ArrayTypeNode | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.UnionType): UnionTypeNode | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.NewExpression): NewExpression | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.NamespaceImport): NamespaceImport | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.PropertyDeclaration): PropertyDeclaration | null;
export function isKind(
  node: Node | undefined,
  kind: SyntaxKind.ObjectLiteralExpression,
): ObjectLiteralExpression | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.ExpressionStatement): ExpressionStatement | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.ImportDeclaration): ImportDeclaration | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.ExportAssignment): ExportAssignment | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.Identifier): Identifier | null;
export function isKind(
  node: Node | undefined,
  kind: SyntaxKind.PropertyAccessExpression,
): PropertyAccessExpression | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.CallExpression): CallExpression | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.NamedImports): NamedImports | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.NewExpression): NewExpression | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.ArrayLiteralExpression): ArrayLiteralExpression | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.StringLiteral): StringLiteral | null;
export function isKind(node: Node | undefined, kind: SyntaxKind.BooleanKeyword): BooleanLiteral | null;
export function isKind(node: Node | undefined, kind: SyntaxKind): Node | null {
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

export function getIdentifierName(
  identifier:
    | PrivateIdentifier
    | BindingName
    | StringLiteral
    | NumericLiteral
    | ComputedPropertyName
    | Expression
    | QualifiedName,
) {
  if (identifier.kind === SyntaxKind.Identifier) {
    const identfier = <Identifier>identifier;
    return identfier.text;
  }

  if (identifier.kind === SyntaxKind.PrivateIdentifier) {
    const identfier = <PrivateIdentifier>identifier;
    return identfier.text;
  }

  if (identifier.kind === SyntaxKind.StringLiteral) {
    const stringLiteral = <StringLiteral>identifier;
    return stringLiteral.text;
  }

  if (identifier.kind === SyntaxKind.NumericLiteral) {
    const stringLiteral = <NumericLiteral>identifier;
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

  return createSourceFile(filepath, readFileSync(filepath).toString(), ScriptTarget.ES2015, true);
}

export function getName(
  identifier: Identifier | Expression | BindingPattern | EntityName | PropertyName | QualifiedName | string,
  nodeType: string,
) {
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

export function hasModifier(modifiers: NodeArray<ModifierLike> | undefined, kind: SyntaxKind): boolean {
  return modifiers !== undefined && modifiers.some((m) => m.kind === kind);
}

export function getType(block: AstBlock, node: TypeNode | undefined): AstType | null;
export function getType(block: AstBlock, node: TypeNode): AstType;
export function getType(block: AstBlock, node: TypeNode | undefined): AstType | null {
  if (!node) {
    return null;
  }

  if (
    node.kind === SyntaxKind.AnyKeyword ||
    node.kind === SyntaxKind.UnknownKeyword ||
    node.kind === SyntaxKind.NumberKeyword ||
    node.kind === SyntaxKind.BigIntKeyword ||
    node.kind === SyntaxKind.ObjectKeyword ||
    node.kind === SyntaxKind.BooleanKeyword ||
    node.kind === SyntaxKind.StringKeyword ||
    node.kind === SyntaxKind.SymbolKeyword ||
    node.kind === SyntaxKind.ThisKeyword ||
    node.kind === SyntaxKind.VoidKeyword ||
    node.kind === SyntaxKind.UndefinedKeyword ||
    node.kind === SyntaxKind.NullKeyword ||
    node.kind === SyntaxKind.NeverKeyword
  ) {
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
    // TODO?
  }

  return null;
}

export function getValueFromExpression(block: AstBlock, expression: Expression): AstValue;
export function getValueFromExpression(block: AstBlock, expression: Expression | undefined): AstValue | null;
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

export function getTypeFromTypeOrExpression(
  block: AstBlock,
  typeNode: TypeNode | undefined,
  expression: Expression | undefined,
): AstType | null {
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
      } else if (value instanceof AstNewExpression) {
        return value.type;
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
