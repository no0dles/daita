import { AstContext } from './ast-context';
import { AstImportDeclaration } from './ast-import-declaration';
import { AstExportDeclaration } from './ast-export-declaration';
import { isKind } from '../ast/utils';
import * as path from 'path';
import * as fs from 'fs';
import { AstBlock } from './ast-block';
import { SourceFile, SyntaxKind } from 'typescript';

export class AstSourceFile {
  block: AstBlock;

  constructor(public context: AstContext,
              private node: SourceFile) {
    this.block = new AstBlock(this, node);

  }

  get fileName() {
    return this.node.fileName;
  }

  get imports(): Generator<AstImportDeclaration> {
    return this.getImports();
  }

  get exports(): Generator<AstExportDeclaration> {
    return this.getExports();
  }

  private* getExports() {
    for (const statement of this.node.statements) {
      const node = isKind(statement, SyntaxKind.ExportDeclaration);
      if (node) {
        yield new AstExportDeclaration(this, node);
      }
    }
  }

  private* getImports() {
    for (const statement of this.node.statements) {
      const node = isKind(statement, SyntaxKind.ImportDeclaration);
      if (node) {
        yield new AstImportDeclaration(this, node);
      }
    }
  }

  getModulePath(moduleSpecifier: string) {
    if (moduleSpecifier.startsWith('.')) {
      const importPath = path.join(path.dirname(this.fileName), moduleSpecifier);
      return this.getPath(importPath);
    } else {
      let pathParts = path.dirname(this.fileName).split(path.sep);
      for (let i = pathParts.length - 1; i >= 0; i--) {
        const nodeModulePath = path.join(pathParts.slice(0, i).join(path.sep), 'node_modules', moduleSpecifier);
        const importPath = this.getPath(nodeModulePath);
        if (importPath) {
          return importPath;
        }
      }
    }
    return null;
  }

  private getPath(importPath: string) {
    const importPaths = [
      path.join(importPath, 'index.ts'),
      path.join(importPath, 'index.d.ts'),
      importPath + '.ts',
      importPath + '.d.ts',
    ];
    for (const impPath of importPaths) {
      if (fs.existsSync(impPath)) {
        return impPath;
      }
    }
    return null;
  }
}
