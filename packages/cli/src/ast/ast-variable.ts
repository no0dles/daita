import {getChildNodes, getIdentifierName, isKind} from './utils';
import * as ts from 'typescript';
import {AstSourceFile} from './ast-source-file';
import {AstVariableCall} from './ast-variable-call';
import {AstVariableInitializer} from './ast-variable-initializer';

export class AstVariable {
  constructor(private sourceFile: AstSourceFile, private parentNode: ts.Node, private variableDeclaration: ts.VariableDeclaration) {
  }

  get exported() {
    if (this.variableDeclaration.modifiers) {
      for (const modifier of this.variableDeclaration.modifiers) {
        if (modifier.kind === ts.SyntaxKind.ExportKeyword) {
          return true;
        }
      }
    }
    return false;
  }

  get initializer(): AstVariableInitializer | null {
    if (this.variableDeclaration.initializer) {
      return new AstVariableInitializer(this.variableDeclaration.initializer);
    }
    return null;
  }

  get name() {
    return getIdentifierName(this.variableDeclaration.name);
  }

  // get objectValue(): AstObjectValue | null {
  //
  // }

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
