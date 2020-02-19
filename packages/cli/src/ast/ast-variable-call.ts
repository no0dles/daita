import {AstSourceFile} from './ast-source-file';
import * as ts from 'typescript';
import {AstVariableCallArgument} from './ast-variable-call-argument';

export class AstVariableCall {
  constructor(private sourceFile: AstSourceFile, private callExpression: ts.CallExpression,
              private propertyAccessExpression: ts.PropertyAccessExpression) {
  }

  get name() {
    return this.propertyAccessExpression.name.text;
  }

  arguments(): AstVariableCallArgument[] {
    const args = new Array<AstVariableCallArgument>();

    for (let i = 0; i < this.callExpression.arguments.length; i++) {
      args.push(new AstVariableCallArgument(this.sourceFile, this.callExpression.arguments[i], i));
    }

    return args;
  }

  argument(index: number): AstVariableCallArgument | null {
    const arg = this.callExpression.arguments[index];
    if (arg) {
      return new AstVariableCallArgument(this.sourceFile, arg, index);
    }
    return null;
  }
}
