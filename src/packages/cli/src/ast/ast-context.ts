import * as path from 'path';
import { parseSourceFile } from '../ast/utils';
import { AstSourceFile } from './ast-source-file';

export class AstContext {
  protected sourceFiles: { [key: string]: AstSourceFile } = {};

  get(fileName: string): AstSourceFile | null {
    const absolutePath = path.resolve(fileName);
    if (!this.sourceFiles[absolutePath]) {
      const sourceFile = parseSourceFile(absolutePath);
      if (sourceFile) {
        this.sourceFiles[absolutePath] = new AstSourceFile(this, sourceFile);
      }
    }
    return this.sourceFiles[absolutePath] ?? null;
  }
}
