import { AstError, isKind } from '../ast/utils';
import { AstValue } from './ast-value';
import { AstSourceFile } from './ast-source-file';
import { ImportDeclaration, SyntaxKind } from 'typescript';
import { AstType } from './ast-type';
import { getName } from './utils';

export class AstImportDeclaration {
  constructor(private sourceFile: AstSourceFile, private node: ImportDeclaration) {}

  getValue(name: string): AstValue | null {
    const exportName = this.exportsName(name);
    if (!exportName) {
      return null;
    }
    const sourceFile = this.getImportSourceFile();
    if (!sourceFile) {
      return null;
    }
    return sourceFile.block.getValue(exportName);
  }

  getType(name: string): AstType | null {
    const exportName = this.exportsName(name);
    if (!exportName) {
      return null;
    }
    const sourceFile = this.getImportSourceFile();
    if (!sourceFile) {
      return null;
    }
    return sourceFile.block.getType(exportName);
  }

  private exportsName(name: string): string | null {
    if (!this.node.importClause) {
      return null;
    }

    if (isKind(this.node.importClause.namedBindings, SyntaxKind.NamedImports)) {
      for (const elm of this.node.importClause.namedBindings.elements) {
        const exportName = getName(elm.name, 'identifier');
        if (exportName === name) {
          if (elm.propertyName) {
            return getName(elm.propertyName, 'identifier');
          }
          return exportName;
        }
      }
    }

    const namespaceImport = isKind(this.node.importClause.namedBindings, SyntaxKind.NamespaceImport);
    if (namespaceImport) {
      //TODO
    }

    return null;
  }

  private getImportSourceFile(): AstSourceFile | null {
    const importPath = this.sourceFile.getModulePath(this.moduleSpecifier);
    if (!importPath) {
      throw new AstError(this.node, `unable to get source file`);
    }

    return this.sourceFile.context.get(importPath);
  }

  private get moduleSpecifier(): string {
    if (isKind(this.node.moduleSpecifier, SyntaxKind.StringLiteral)) {
      return this.node.moduleSpecifier.text;
    }

    throw new AstError(this.node, 'unable to parse module specifier');
  }
}
