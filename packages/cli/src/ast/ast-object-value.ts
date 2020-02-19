import {getChildNodes, getIdentifierName, isKind} from './utils';
import {AstSourceFile} from './ast-source-file';
import * as ts from 'typescript';

export class AstObjectValue {
  constructor(private sourceFile: AstSourceFile, private expression: ts.Expression) {
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

  get stringValue(): string | null {
    const stringLiteral = isKind(this.expression, ts.SyntaxKind.StringLiteral);
    if (stringLiteral) {
      return stringLiteral.text;
    }
    return null;
  }
}
