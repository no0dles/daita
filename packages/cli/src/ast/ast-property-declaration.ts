import {getIdentifierName} from './utils';
import {AstSourceFile} from './ast-source-file';
import * as ts from 'typescript';
import {AstType, parsePropertyType} from './ast-type';
import {AstObjectValue} from './ast-object-value';

export class AstPropertyDeclaration {
  public name: string | null = null;
  public initializer: AstObjectValue | null = null;
  public type: AstType | null = null;

  constructor(private sourceFile: AstSourceFile,
              private propertyDeclaration: ts.PropertyDeclaration) {
    this.name = getIdentifierName(this.propertyDeclaration.name);
    if (this.propertyDeclaration.initializer) {
      this.initializer = new AstObjectValue(this.propertyDeclaration.initializer);
    }
    if (this.propertyDeclaration.type) {
      this.type = parsePropertyType(this.sourceFile, this.propertyDeclaration);
    }
  }
}
