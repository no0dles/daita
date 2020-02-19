import {isKind} from './utils';
import * as ts from 'typescript';
import {AstNewConstructor} from './ast-new-constructor';

export class AstVariableInitializer {
  public stringValue: string | null = null;
  public arrayValue: AstVariableInitializer[] | null = null;
  public newConstructor: AstNewConstructor | null = null;

  constructor(private expression: ts.Expression) {
    const stringLiteral = isKind(this.expression, ts.SyntaxKind.StringLiteral);
    if (stringLiteral) {
      this.stringValue = stringLiteral.text;
    }
    const arrayLiteral = isKind(this.expression, ts.SyntaxKind.ArrayLiteralExpression);
    if (arrayLiteral) {
      this.arrayValue = arrayLiteral.elements.map(elm => new AstVariableInitializer(elm));
    }
    const newExpression = isKind(this.expression, ts.SyntaxKind.NewExpression);
    if (newExpression) {
      this.newConstructor = new AstNewConstructor(newExpression);
    }
  }
}
