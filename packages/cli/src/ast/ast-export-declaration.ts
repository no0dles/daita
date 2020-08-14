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
    const sourceFile = this.getExportSourceFile();
    if (!sourceFile) {
      return null;
    }
    return sourceFile.block.getValue(name);
  }

  getType(name: string): AstType | null {
    const sourceFile = this.getExportSourceFile();
    if (!sourceFile) {
      return null;
    }
    return sourceFile.block.getType(name);
  }

  private get moduleSpecifier(): string | null {
    if (!this.node.moduleSpecifier) {
      return null;
    }
    const stringLiteral = isKind(this.node.moduleSpecifier, SyntaxKind.StringLiteral);
    if (stringLiteral) {
      return stringLiteral.text;
    }

    throw new AstError(this.node, 'unable to parse module specifier');
  }

  private getExportSourceFile(): AstSourceFile | null {
    const module = this.moduleSpecifier;
    if (!module) {
      return null;
    }
    const importPath = this.sourceFile.getModulePath(module);
    if (!importPath) {
      return null;
    }

    return this.sourceFile.context.get(importPath);
  }
}
