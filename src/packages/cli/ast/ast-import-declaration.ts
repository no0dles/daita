import { AstError, isKind } from '../ast/utils';
import { AstValue } from './ast-value';
import { AstSourceFile } from './ast-source-file';
import { ImportDeclaration, SyntaxKind } from 'typescript';
import { AstType } from './ast-type';
import { getName } from './utils';

export class AstImportDeclaration {
  constructor(
    private sourceFile: AstSourceFile,
    private node: ImportDeclaration,
  ) {}

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

    const namedImport = isKind(
      this.node.importClause.namedBindings,
      SyntaxKind.NamedImports,
    );
    if (namedImport) {
      for (const elm of namedImport.elements) {
        const exportName = getName(elm.name, 'identifier');
        if (exportName === name) {
          if (elm.propertyName) {
            return getName(elm.propertyName, 'identifier');
          }
          return exportName;
        }
      }
    }

    const namespaceImport = isKind(
      this.node.importClause.namedBindings,
      SyntaxKind.NamespaceImport,
    );
    if (namespaceImport) {
      //TODO
    }

    return null;
  }

  private getImportSourceFile(): AstSourceFile | null {
    const importPath = this.sourceFile.getModulePath(this.moduleSpecifier);
    if (!importPath) {
      console.warn('import not found');
      return null;
    }

    return this.sourceFile.context.get(importPath);
  }

  private get moduleSpecifier(): string {
    const stringLiteral = isKind(
      this.node.moduleSpecifier,
      SyntaxKind.StringLiteral,
    );
    if (stringLiteral) {
      return stringLiteral.text;
    }

    throw new AstError(this.node, 'unable to parse module specifier');
  }
}
