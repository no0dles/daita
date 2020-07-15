import {getIdentifierName} from './utils';
import * as ts from 'typescript';
import {AstObjectValue} from './ast-object-value';
import { AstSourceFile } from './ast-source-file';

export class AstNewConstructor {
  typeName: string | null = null;
  arguments: AstObjectValue[] = [];

  constructor(private sourceFile: AstSourceFile,
              private expression: ts.NewExpression) {
    this.typeName = getIdentifierName(expression.expression);

    if(this.expression.arguments) {
      this.arguments = this.expression.arguments.map(arg => new AstObjectValue(this.sourceFile, arg));
    }
  }
}
