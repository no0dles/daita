import {getIdentifierName} from './utils';
import * as ts from 'typescript';
import {AstObjectValue} from './ast-object-value';

export class AstNewConstructor {
  public typeName: string | null = null;
  public arguments: AstObjectValue[] = [];

  constructor(private expression: ts.NewExpression) {
    this.typeName = getIdentifierName(expression.expression);

    if(this.expression.arguments) {
      this.arguments = this.expression.arguments.map(arg => new AstObjectValue(arg));
    }
  }
}