import {getChildNodes, getIdentifierName, isKind} from './utils';
import * as ts from 'typescript';
import {AstNewConstructor} from './ast-new-constructor';

export class AstObjectValue {
  stringValue: string | null = null;
  booleanValue: boolean | null = null;
  arrayValue: AstObjectValue[] | null = null;
  newConstructor: AstNewConstructor | null = null;
  anyValue: any;

  constructor(private expression: ts.Expression) {
    const stringLiteral = isKind(this.expression, ts.SyntaxKind.StringLiteral);
    const arrayLiteral = isKind(this.expression, ts.SyntaxKind.ArrayLiteralExpression);
    const objectLiteral = isKind(this.expression, ts.SyntaxKind.ObjectLiteralExpression);
    const newExpression = isKind(this.expression, ts.SyntaxKind.NewExpression);

    if (stringLiteral) {
      this.stringValue = stringLiteral.text;
      this.anyValue = stringLiteral.text;
    } else if (arrayLiteral) {
      this.arrayValue = arrayLiteral.elements.map(elm => new AstObjectValue(elm));
      this.anyValue = this.arrayValue.map(v => v.anyValue);
    } else if (objectLiteral) {
      const obj: { [key: string]: any } = {};
      for (const prop of this.properties()) {
        obj[prop.name] = prop.value.anyValue;
      }
      this.anyValue = obj;
    } else if (newExpression) {
      this.newConstructor = new AstNewConstructor(newExpression);
    } else if (this.expression.kind === ts.SyntaxKind.TrueKeyword) {
      this.booleanValue = true;
      this.anyValue = true;
    } else if (this.expression.kind === ts.SyntaxKind.FalseKeyword) {
      this.booleanValue = false;
      this.anyValue = false;
    } else if (this.expression.kind === ts.SyntaxKind.NullKeyword) {
      this.anyValue = null;
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
        return new AstObjectValue(propertyAssignment.initializer);
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
        value: new AstObjectValue(propertyAssignment.initializer),
      };
    });
  }
}
