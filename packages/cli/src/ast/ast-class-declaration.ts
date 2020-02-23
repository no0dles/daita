import {getIdentifierName, isKind} from './utils';
import * as ts from 'typescript';
import {AstSourceFile} from './ast-source-file';
import {AstPropertyDeclaration} from './ast-property-declaration';

export class AstClassDeclaration {
  name: string | null = null;

  constructor(private sourceFile: AstSourceFile,
              private classDeclaration: ts.ClassDeclaration) {
    if (this.classDeclaration.name) {
      this.name = getIdentifierName(this.classDeclaration.name);
    }
  }

  get extendedClass(): AstClassDeclaration | null {
    if (this.classDeclaration.heritageClauses) {
      for (const heritageClass of this.classDeclaration.heritageClauses) {
        for (const type of heritageClass.types) {
          const className = getIdentifierName(type.expression);
          return this.sourceFile.getClassDeclaration(className, {includeImport: true});
        }
      }
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

  getProperties(options?: { includedInherited?: boolean }): AstPropertyDeclaration[] {
    const astPropertyDeclaration = new Array<AstPropertyDeclaration>();
    for (const member of this.classDeclaration.members) {
      const propertyDeclaration = isKind(member, ts.SyntaxKind.PropertyDeclaration);
      if (!propertyDeclaration) {
        continue;
      }

      astPropertyDeclaration.push(new AstPropertyDeclaration(this.sourceFile, propertyDeclaration));
    }
    if (options && options.includedInherited) {
      const extendedClass = this.extendedClass;
      if (extendedClass) {
        astPropertyDeclaration.push(...extendedClass.getProperties());
      }
    }
    return astPropertyDeclaration;
  }

  getProperty(name: string, options?: { includedInherited?: boolean }): AstPropertyDeclaration | null {
    const astPropertyDeclarations = this.getProperties(options);
    for (const astPropertyDeclaration of astPropertyDeclarations) {
      if (astPropertyDeclaration.name === name) {
        return astPropertyDeclaration;
      }
    }
    return null;
  }
}