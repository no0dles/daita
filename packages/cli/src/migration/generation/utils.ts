import * as ts from 'typescript';
import { readFileSync } from 'fs';

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
  kind: ts.SyntaxKind.NewExpression,
): ts.NewExpression | null;
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

export function parseSourceFile(file: string) {
  const filepath = file.endsWith('.ts') ? file : `${file}.ts`;

  return ts.createSourceFile(
    filepath,
    readFileSync(filepath).toString(),
    ts.ScriptTarget.ES2015,
    true,
  );
}
