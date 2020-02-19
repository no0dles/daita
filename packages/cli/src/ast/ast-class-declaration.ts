import {getIdentifierName, isKind} from './utils';
import * as ts from 'typescript';
import {AstSourceFile} from './ast-source-file';
import {AstPropertyDeclaration} from './ast-property-declaration';

export class AstClassDeclaration {
  constructor(private sourceFile: AstSourceFile,
              private classDeclaration: ts.ClassDeclaration) {
  }

  get name(): string | null {
    if (this.classDeclaration.name) {
      return getIdentifierName(this.classDeclaration.name);
    }
    return null;
  }

  get exported() {
    if (!this.classDeclaration.modifiers) {
      return false;
    }
    for (const modifier of this.classDeclaration.modifiers) {
      if (modifier.kind === ts.SyntaxKind.ExportKeyword) {
        return true;
      }
    }
    return false;
  }

  getProperties(): AstPropertyDeclaration[] {
    const astPropertyDeclaration = new Array<AstPropertyDeclaration>();
    for (const member of this.classDeclaration.members) {
      const propertyDeclaration = isKind(member, ts.SyntaxKind.PropertyDeclaration);
      if (!propertyDeclaration) {
        continue;
      }

      astPropertyDeclaration.push(new AstPropertyDeclaration(this.sourceFile, this.classDeclaration, propertyDeclaration));
    }
    return astPropertyDeclaration;
  }

  getProperty(name: string): AstPropertyDeclaration | null {
    const astPropertyDeclarations = this.getProperties();
    for (const astPropertyDeclaration of astPropertyDeclarations) {
      if (astPropertyDeclaration.name === name) {
        return astPropertyDeclaration;
      }
    }
    return null;
  }
}