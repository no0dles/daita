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
  ScriptTarget,
  ArrowFunction,
  Block,
} from 'typescript';
import { AstArrayType } from './ast-array-type';
import { AstVariableDeclaration } from './ast-variable-declaration';
import { AstArrayValue } from './ast-array-value';
import { AstNewExpression } from './ast-new-expression';
import { AstCallExpression } from './ast-call-expression';
import { AstPropertyAccessExpression } from './ast-property-access-expression';
import { AstSpreadElement } from './ast-spread-element';
import { AstRegularExpressionLiteral } from './ast-regular-expression-literal';
import { AstArrowFunction } from './ast-arrow-function';

export function isKind(node: Node | undefined, kind: SyntaxKind.TypeLiteral): node is TypeLiteralNode;
export function isKind(node: Node | undefined, kind: SyntaxKind.Block): node is Block;
export function isKind(node: Node | undefined, kind: SyntaxKind.ArrowFunction): node is ArrowFunction;
export function isKind(node: Node | undefined, kind: SyntaxKind.ArrowFunction): node is ArrowFunction;
export function isKind(node: Node | undefined, kind: SyntaxKind.SpreadElement): node is SpreadElement;
export function isKind(node: Node | undefined, kind: SyntaxKind.TypeAliasDeclaration): node is TypeAliasDeclaration;
export function isKind(
  node: Node | undefined,
  kind: SyntaxKind.RegularExpressionLiteral,
): node is RegularExpressionLiteral;
export function isKind(node: Node | undefined, kind: SyntaxKind.ExportDeclaration): node is ExportDeclaration;
export function isKind(node: Node | undefined, kind: SyntaxKind.EnumDeclaration): node is EnumDeclaration;
export function isKind(node: Node | undefined, kind: SyntaxKind.TrueKeyword): node is BooleanLiteral;
export function isKind(node: Node | undefined, kind: SyntaxKind.FalseKeyword): node is BooleanLiteral;
export function isKind(node: Node | undefined, kind: SyntaxKind.NullKeyword): node is NullLiteral;
export function isKind(
  node: Node | undefined,
  kind: SyntaxKind.UndefinedKeyword,
): node is KeywordTypeNode<SyntaxKind.UndefinedKeyword>;
export function isKind(node: Node | undefined, kind: SyntaxKind.SpreadAssignment): node is SpreadAssignment;
export function isKind(
  node: Node | undefined,
  kind: SyntaxKind.ShorthandPropertyAssignment,
): node is ShorthandPropertyAssignment;
export function isKind(node: Node | undefined, kind: SyntaxKind.NamedImports): node is NamedImports;
export function isKind(node: Node | undefined, kind: SyntaxKind.NamespaceImport): node is NamespaceImport;
export function isKind(node: Node | undefined, kind: SyntaxKind.ClassDeclaration): node is ClassDeclaration;
export function isKind(node: Node | undefined, kind: SyntaxKind.VariableStatement): node is VariableStatement;
export function isKind(node: Node | undefined, kind: SyntaxKind.FunctionDeclaration): node is FunctionDeclaration;
export function isKind(node: Node | undefined, kind: SyntaxKind.MethodDeclaration): node is MethodDeclaration;
export function isKind(node: Node | undefined, kind: SyntaxKind.PropertyAssignment): node is PropertyAssignment;
export function isKind(node: Node | undefined, kind: SyntaxKind.NamedExports): node is NamedExports;
export function isKind(node: Node | undefined, kind: SyntaxKind.LiteralType): node is LiteralTypeNode;
export function isKind(node: Node | undefined, kind: SyntaxKind.StringLiteral): node is StringLiteral;
export function isKind(node: Node | undefined, kind: SyntaxKind.NumericLiteral): node is NumericLiteral;
export function isKind(node: Node | undefined, kind: SyntaxKind.NumericLiteral): node is NumericLiteral;
export function isKind(node: Node | undefined, kind: SyntaxKind.PropertySignature): node is PropertySignature;
export function isKind(node: Node | undefined, kind: SyntaxKind.TypeReference): node is TypeReferenceNode;
export function isKind(node: Node | undefined, kind: SyntaxKind.ArrayType): node is ArrayTypeNode;
export function isKind(node: Node | undefined, kind: SyntaxKind.UnionType): node is UnionTypeNode;
export function isKind(node: Node | undefined, kind: SyntaxKind.NewExpression): node is NewExpression;
export function isKind(node: Node | undefined, kind: SyntaxKind.NamespaceImport): node is NamespaceImport;
export function isKind(node: Node | undefined, kind: SyntaxKind.PropertyDeclaration): node is PropertyDeclaration;
export function isKind(
  node: Node | undefined,
  kind: SyntaxKind.ObjectLiteralExpression,
): node is ObjectLiteralExpression;
export function isKind(node: Node | undefined, kind: SyntaxKind.ExpressionStatement): node is ExpressionStatement;
export function isKind(node: Node | undefined, kind: SyntaxKind.ImportDeclaration): node is ImportDeclaration;
export function isKind(node: Node | undefined, kind: SyntaxKind.ExportAssignment): node is ExportAssignment;
export function isKind(node: Node | undefined, kind: SyntaxKind.Identifier): node is Identifier;
export function isKind(
  node: Node | undefined,
  kind: SyntaxKind.PropertyAccessExpression,
): node is PropertyAccessExpression;
export function isKind(node: Node | undefined, kind: SyntaxKind.CallExpression): node is CallExpression;
export function isKind(node: Node | undefined, kind: SyntaxKind.NamedImports): node is NamedImports;
export function isKind(node: Node | undefined, kind: SyntaxKind.NewExpression): node is NewExpression;
export function isKind(node: Node | undefined, kind: SyntaxKind.ArrayLiteralExpression): node is ArrayLiteralExpression;
export function isKind(node: Node | undefined, kind: SyntaxKind.StringLiteral): node is StringLiteral;
export function isKind(node: Node | undefined, kind: SyntaxKind.BooleanKeyword): node is BooleanLiteral;
export function isKind(node: Node | undefined, kind: SyntaxKind): node is Node {
  if (!node) {
    return false;
  }

  if (node.kind === kind) {
    return true;
  }
  return false;
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

  if (isKind(identifier, SyntaxKind.Identifier)) {
    return identifier.getText();
  }

  //TODO binding pattern + property name + qualifiedname
  throw new AstError(identifier, `unable to parse name of ${nodeType}`);
}

export function hasModifier(modifiers: ModifiersArray | undefined, kind: SyntaxKind): boolean {
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

  if (isKind(node, SyntaxKind.LiteralType)) {
    return new AstLiteralType(node);
  }

  if (isKind(node, SyntaxKind.TypeLiteral)) {
    return new AstTypeLiteralType(block, node);
  }

  if (isKind(node, SyntaxKind.TypeReference)) {
    return new AstReferenceType(block, node);
  }

  if (isKind(node, SyntaxKind.ArrayType)) {
    return new AstArrayType(block, node);
  }

  if (isKind(node, SyntaxKind.UnionType)) {
    return new AstUnionType(block, node);
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

  if (isKind(expression, SyntaxKind.NumericLiteral)) {
    return new AstNumericLiteralValue(expression);
  }

  if (isKind(expression, SyntaxKind.StringLiteral)) {
    return new AstStringLiteralValue(expression);
  }

  if (isKind(expression, SyntaxKind.ObjectLiteralExpression)) {
    return new AstObjectValue(block, expression);
  }

  if (isKind(expression, SyntaxKind.NewExpression)) {
    return new AstNewExpression(block, expression);
  }

  if (isKind(expression, SyntaxKind.TrueKeyword)) {
    return new AstBooleanLiteralValue(expression);
  }

  if (isKind(expression, SyntaxKind.FalseKeyword)) {
    return new AstBooleanLiteralValue(expression);
  }

  if (isKind(expression, SyntaxKind.NullKeyword)) {
    return new AstKeywordValue(expression);
  }

  if (isKind(expression, SyntaxKind.UndefinedKeyword)) {
    return new AstKeywordValue(expression);
  }

  if (isKind(expression, SyntaxKind.ArrayLiteralExpression)) {
    return new AstArrayValue(block, expression);
  }

  if (isKind(expression, SyntaxKind.Identifier)) {
    return block.getValue(expression);
  }

  if (isKind(expression, SyntaxKind.CallExpression)) {
    return new AstCallExpression(block, expression);
  }

  if (isKind(expression, SyntaxKind.PropertyAccessExpression)) {
    return new AstPropertyAccessExpression(block, expression);
  }

  if (isKind(expression, SyntaxKind.SpreadElement)) {
    return new AstSpreadElement(block, expression);
  }

  if (isKind(expression, SyntaxKind.RegularExpressionLiteral)) {
    return new AstRegularExpressionLiteral(block, expression);
  }

  if (isKind(expression, SyntaxKind.ArrowFunction)) {
    return new AstArrowFunction(block, expression);
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
