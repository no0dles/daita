import * as ts from 'typescript';
import * as path from 'path';
import { readFileSync, existsSync } from 'fs';

export function getFirstChildNode(
  node: ts.Node,
  kind: ts.SyntaxKind.Identifier,
): ts.Identifier | null;
export function getFirstChildNode(
  node: ts.Node,
  kind: ts.SyntaxKind.PropertyDeclaration,
): ts.PropertyDeclaration | null;
export function getFirstChildNode(
  node: ts.Node,
  kind: ts.SyntaxKind.ExportAssignment,
): ts.ExportAssignment | null;
export function getFirstChildNode(
  node: ts.Node,
  kind: ts.SyntaxKind.ClassDeclaration,
): ts.ClassDeclaration | null;
export function getFirstChildNode(
  node: ts.Node,
  kind: ts.SyntaxKind,
): ts.Node | null {
  let result: ts.Node | null = null;
  ts.forEachChild(node, childNode => {
    if (result === null && childNode.kind === kind) {
      result = childNode;
    }
  });
  return result;
}

export function getChildNodes(
  node: ts.Node,
  kind: ts.SyntaxKind.VariableStatement,
): ts.VariableStatement[];
export function getChildNodes(
  node: ts.Node,
  kind: ts.SyntaxKind.ExportDeclaration,
): ts.ExportDeclaration[];
export function getChildNodes(
  node: ts.Node,
  kind: ts.SyntaxKind.PropertyAssignment,
): ts.PropertyAssignment[];
export function getChildNodes(
  node: ts.Node,
  kind: ts.SyntaxKind.CallExpression,
): ts.CallExpression[];
export function getChildNodes(
  node: ts.Node,
  kind: ts.SyntaxKind.ExpressionStatement,
): ts.ExpressionStatement[];
export function getChildNodes(
  node: ts.Node,
  kind: ts.SyntaxKind.ImportDeclaration,
): ts.ImportDeclaration[];
export function getChildNodes(
  node: ts.Node,
  kind: ts.SyntaxKind.Identifier,
): ts.Identifier[];
export function getChildNodes(
  node: ts.Node,
  kind: ts.SyntaxKind.PropertyDeclaration,
): ts.PropertyDeclaration[];
export function getChildNodes(
  node: ts.Node,
  kind: ts.SyntaxKind.ExportAssignment,
): ts.ExportAssignment[];
export function getChildNodes(
  node: ts.Node,
  kind: ts.SyntaxKind.ClassDeclaration,
): ts.ClassDeclaration[];
export function getChildNodes(
  node: ts.Node,
  kind: ts.SyntaxKind.VariableDeclarationList,
): ts.VariableDeclarationList[];
export function getChildNodes(
  node: ts.Node,
  kind: ts.SyntaxKind.VariableDeclaration,
): ts.VariableDeclaration[];
export function getChildNodes(node: ts.Node, kind: ts.SyntaxKind): ts.Node[] {
  const childNodes: ts.Node[] = [];
  ts.forEachChild(node, childNode => {
    if (childNode.kind === kind) {
      childNodes.push(childNode);
    }
  });
  return childNodes;
}

export function isKind(
  node: ts.Node | undefined,
  kind: ts.SyntaxKind.TypeLiteral,
): ts.TypeLiteralNode | null;
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

export function getBooleanValue(literal: ts.BooleanLiteral): boolean {
  if (literal.kind === ts.SyntaxKind.TrueKeyword) {
    return true;
  } else if (literal.kind === ts.SyntaxKind.FalseKeyword) {
    return false;
  }

  throw new Error('not a bool');
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

  throw new Error(`unable to parse ${ts.SyntaxKind[identifier.kind]} ast node`);
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
