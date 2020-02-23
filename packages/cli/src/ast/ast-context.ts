import * as path from 'path';
import {AstSourceFile} from './ast-source-file';
import {parseSourceFile} from './utils';
import * as ts from 'typescript';

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

export class MockAstContext extends AstContext {
  mock(fileName: string, fileContent: string) {
    const filepath = fileName.endsWith('.ts') ? fileName : `${fileName}.ts`;
    const sourceFile = ts.createSourceFile(
      filepath,
      fileContent,
      ts.ScriptTarget.ES2015,
      true,
    );
    this.sourceFiles[filepath] = new AstSourceFile(this, sourceFile);
  }

  get(fileName: string): AstSourceFile | null {
    const filepath = fileName.endsWith('.ts') ? fileName : `${fileName}.ts`;
    return this.sourceFiles[filepath] ?? null;
  }
}