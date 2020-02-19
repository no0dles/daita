import {getIdentifierName} from './utils';
import {AstSourceFile} from './ast-source-file';
import * as ts from 'typescript';
import {AstType} from './ast-type';
import {AstVariableInitializer} from './ast-variable-initializer';

export class AstPropertyDeclaration {
  public name: string | null = null;
  public initializer: AstVariableInitializer | null = null;
  public type: AstType | null = null;

  constructor(private sourceFile: AstSourceFile,
              private classDeclaration: ts.ClassDeclaration,
              private propertyDeclaration: ts.PropertyDeclaration) {
    this.name = getIdentifierName(this.propertyDeclaration.name);
    if (this.propertyDeclaration.initializer) {
      this.initializer = new AstVariableInitializer(this.propertyDeclaration.initializer);
    }
    if (this.propertyDeclaration.type) {
      this.type = new AstType(this.propertyDeclaration.type);
    }
  }
}
