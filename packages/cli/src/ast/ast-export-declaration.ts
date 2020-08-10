import { AstError, isKind } from '../ast/utils';
import { AstSourceFile } from './ast-source-file';
import { ExportDeclaration, SyntaxKind } from 'typescript';
import { AstValue } from './ast-value';
import { AstType } from './ast-type';

export class AstExportDeclaration {
  constructor(private sourceFile: AstSourceFile,
              private node: ExportDeclaration) {
  }

  getValue(name: string): AstValue | null {
    const importPath = this.sourceFile.getModulePath(this.moduleSpecifier);
    if (!importPath) {
      console.warn('import null');
      return null;
    }
    const sourceFile = this.getExportSourceFile();
    if (!sourceFile) {
      console.warn('import null');
      return null;
    }
    return sourceFile.block.getValue(name);
  }

  getType(name: string): AstType | null {
    const importPath = this.sourceFile.getModulePath(this.moduleSpecifier);
    if (!importPath) {
      console.warn('import null');
      return null;
    }
    const sourceFile = this.getExportSourceFile();
    if (!sourceFile) {
      console.warn('import null');
      return null;
    }
    return sourceFile.block.getType(name);
  }

  private get moduleSpecifier(): string {
    const stringLiteral = isKind(this.node.moduleSpecifier, SyntaxKind.StringLiteral);
    if (stringLiteral) {
      return stringLiteral.text;
    }

    throw new AstError(this.node, 'unable to parse module specifier');
  }

  private getExportSourceFile(): AstSourceFile | null {
    const importPath = this.sourceFile.getModulePath(this.moduleSpecifier);
    if (!importPath) {
      console.warn('import not found');
      return null;
    }

    return this.sourceFile.context.get(importPath);
  }
}
