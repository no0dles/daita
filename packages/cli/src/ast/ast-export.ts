import {AstSourceFile} from './ast-source-file';

export class AstExport {
  constructor(private sourceFile: AstSourceFile,
              public name: string) {
  }

  get classDeclaration() {
    return this.sourceFile.getClassDeclaration(this.name);
  }

  get variable() {
    return this.sourceFile.getVariable(this.name);
  }
}