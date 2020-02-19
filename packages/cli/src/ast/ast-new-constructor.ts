import {getIdentifierName} from './utils';
import {AstVariableInitializer} from './ast-variable-initializer';
import * as ts from 'typescript';

export class AstNewConstructor {
  public typeName: string | null = null;
  public arguments: AstVariableInitializer[] = [];

  constructor(private expression: ts.NewExpression) {
    this.typeName = getIdentifierName(expression.expression);

    if(this.expression.arguments) {
      this.arguments = this.expression.arguments.map(arg => new AstVariableInitializer(arg));
    }
  }
}