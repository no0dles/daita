import { getChildNodes, getIdentifierName, isKind } from './utils';
import * as ts from 'typescript';
import { AstNewConstructor } from './ast-new-constructor';
import { AstSourceFile } from './ast-source-file';
import { AstVariableCall } from './ast-variable-call';

export class AstObjectValue {
  stringValue: string | null = null;
  numericValue: number | null = null;
  booleanValue: boolean | null = null;
  arrayValue: AstObjectValue[] | null = null;
  newConstructor: AstNewConstructor | null = null;
  callValue: { name: string, args: AstObjectValue[] } | null = null;
  objectValue: { [key: string]: AstObjectValue } | null = null;

  constructor(private sourceFile: AstSourceFile,
              private expression: ts.Expression) {
    const stringLiteral = isKind(this.expression, ts.SyntaxKind.StringLiteral);
    const numericLiteral = isKind(this.expression, ts.SyntaxKind.NumericLiteral);
    const arrayLiteral = isKind(this.expression, ts.SyntaxKind.ArrayLiteralExpression);
    const objectLiteral = isKind(this.expression, ts.SyntaxKind.ObjectLiteralExpression);
    const newExpression = isKind(this.expression, ts.SyntaxKind.NewExpression);
    const identifier = isKind(this.expression, ts.SyntaxKind.Identifier);
    const callExpression = isKind(this.expression, ts.SyntaxKind.CallExpression);

    if (stringLiteral) {
      this.stringValue = stringLiteral.text;
    } else if (numericLiteral) {
      this.numericValue = parseFloat(numericLiteral.text);
    } else if (arrayLiteral) {
      this.arrayValue = arrayLiteral.elements.map(elm => new AstObjectValue(this.sourceFile, elm));
    } else if (objectLiteral) {
      const obj: { [key: string]: AstObjectValue } = {};
      for (const prop of objectLiteral.properties) {
        const propAssign = isKind(prop, ts.SyntaxKind.PropertyAssignment);
        if (propAssign) {
          obj[getIdentifierName(propAssign.name)] = new AstObjectValue(this.sourceFile, propAssign.initializer);
        }
      }
      this.objectValue = obj;
    } else if (newExpression) {
      this.newConstructor = new AstNewConstructor(this.sourceFile, newExpression);
    } else if (this.expression.kind === ts.SyntaxKind.TrueKeyword) {
      this.booleanValue = true;
    } else if (this.expression.kind === ts.SyntaxKind.FalseKeyword) {
      this.booleanValue = false;
    } else if (this.expression.kind === ts.SyntaxKind.NullKeyword) {

    } else if (identifier) {
      const variable = sourceFile.getVariable(identifier.text, { includeImported: true });
      if (variable) {
        this.booleanValue = variable?.getInitializer()?.booleanValue ?? null;
        this.numericValue = variable?.getInitializer()?.numericValue ?? null;
        this.stringValue = variable?.getInitializer()?.stringValue ?? null;
        this.arrayValue = variable?.getInitializer()?.arrayValue ?? null;
      }
    } else if (callExpression) {
      const name = getIdentifierName(callExpression.expression);
      const args: AstObjectValue[] = [];
      for (const arg of callExpression.arguments) {
        args.push(new AstObjectValue(this.sourceFile, arg));
      }
      this.callValue = { name, args };
    }
  }

  property(name: string): AstObjectValue | null {
    const propertyAssignments = getChildNodes(
      this.expression,
      ts.SyntaxKind.PropertyAssignment,
    );
    for (const propertyAssignment of propertyAssignments) {
      const propertyName = getIdentifierName(propertyAssignment.name);
      if (propertyName === name) {
        return new AstObjectValue(this.sourceFile, propertyAssignment.initializer);
      }
    }

    return null;
  }

  properties() {
    const propertyAssignments = getChildNodes(
      this.expression,
      ts.SyntaxKind.PropertyAssignment,
    );

    return propertyAssignments.map(propertyAssignment => {
      return {
        name: getIdentifierName(propertyAssignment.name),
        value: new AstObjectValue(this.sourceFile, propertyAssignment.initializer),
      };
    });
  }
}
