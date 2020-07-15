import { getChildNodes, getIdentifierName, isKind } from './utils';
import * as ts from 'typescript';
import { AstSourceFile } from './ast-source-file';
import { AstVariableCall } from './ast-variable-call';
import { AstObjectValue } from './ast-object-value';

export class AstVariable {
  private initializer: AstObjectValue | null = null;
  name: string;

  constructor(public sourceFile: AstSourceFile,
              private parentNode: ts.Node,
              private variableStatement: ts.VariableStatement,
              private variableDeclaration: ts.VariableDeclaration) {
    this.name = getIdentifierName(this.variableDeclaration.name);
  }

  getInitializer() {
    if (this.initializer) {
      return this.initializer;
    }
    if (this.variableDeclaration.initializer) {
      this.initializer = new AstObjectValue(this.sourceFile, this.variableDeclaration.initializer);
    }
    return this.initializer;
  }

  get exported() {
    if (this.variableStatement.modifiers) {
      for (const modifier of this.variableStatement.modifiers) {
        if (modifier.kind === ts.SyntaxKind.ExportKeyword) {
          return true;
        }
      }
    }
    return false;
  }

  getCalls(options?: { name: string }): AstVariableCall[] {
    const variableCalls = new Array<AstVariableCall>();

    const expressionStatements = getChildNodes(
      this.parentNode,
      ts.SyntaxKind.ExpressionStatement,
    );

    for (const expressionStatement of expressionStatements) {
      const callExpression = isKind(
        expressionStatement.expression,
        ts.SyntaxKind.CallExpression,
      );
      if (!callExpression) {
        continue;
      }

      const propertyAccessExpr = isKind(
        callExpression.expression,
        ts.SyntaxKind.PropertyAccessExpression,
      );
      if (!propertyAccessExpr) {
        continue;
      }

      const variableExpression = isKind(
        propertyAccessExpr.expression,
        ts.SyntaxKind.Identifier,
      );
      if (!variableExpression) {
        continue;
      }

      if (variableExpression.text !== this.name) {
        continue;
      }

      const variableCall = new AstVariableCall(this.sourceFile, callExpression, propertyAccessExpr);
      if (options && options.name) {
        if (variableCall.name !== options.name) {
          continue;
        }
      }

      variableCalls.push(variableCall);
    }

    return variableCalls;
  }
}
