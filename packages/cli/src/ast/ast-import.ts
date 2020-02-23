import {getIdentifierName, isKind} from './utils';
import * as path from 'path';
import * as ts from 'typescript';
import {AstSourceFile} from './ast-source-file';
import {AstExport} from './ast-export';
import {AstContext} from './ast-context';

export class AstImport {
  constructor(private context: AstContext,
              private sourceFile: AstSourceFile,
              private importDeclaration: ts.ImportDeclaration) {
  }

  getExported() {
    if (!this.importDeclaration.importClause) {
      return [];
    }

    const importPath = getIdentifierName(this.importDeclaration.moduleSpecifier);
    if (!importPath.startsWith('.')) {
      return []; //TODO node_modules
    }

    const importFileName = path.join(path.dirname(this.sourceFile.fileName), importPath);
    const importSourceFile = this.context.get(importFileName);
    if(!importSourceFile) {
      throw new Error('unable to locate import');
    }


    if (this.importDeclaration.importClause.namedBindings) {
      const namedImport = isKind(this.importDeclaration.importClause.namedBindings, ts.SyntaxKind.NamedImports);
      if (namedImport) {
        const astExports = new Array<AstExport>();
        for (const element of namedImport.elements) {
          const importName = getIdentifierName(element.name);
          const exportedValue = importSourceFile.getExport(importName);
          if (exportedValue) {
            astExports.push(exportedValue);
          }
        }

        return astExports;
      }

      const namespaceImport = isKind(this.importDeclaration.importClause.namedBindings, ts.SyntaxKind.NamespaceImport);
      if (namespaceImport) {
        return importSourceFile.getExports();
      }
    }

    const identifier = isKind(this.importDeclaration.importClause.name, ts.SyntaxKind.Identifier);
    if (identifier) {
      const defaultExport = importSourceFile.getDefaultExport();
      if (defaultExport) {
        return [defaultExport];
      }
      return [];
    }

    throw new Error('unknown import' + ts.SyntaxKind[this.importDeclaration.importClause.kind]);
  }
}
