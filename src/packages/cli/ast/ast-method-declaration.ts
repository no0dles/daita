import { AstParameterDeclaration } from './ast-parameter-declaration';
import { getName } from './utils';
import { AstBlock } from './ast-block';
import { MethodDeclaration } from 'typescript';
import { AstNode } from './ast-node';

export class AstMethodDeclaration implements AstNode {
  //returnType: AstType;
  //accessType: public|private

  constructor(private block: AstBlock, public node: MethodDeclaration) {}

  get name(): string {
    return getName(this.node.name, 'method declaration');
  }

  get parameters(): Generator<AstParameterDeclaration> {
    return this.getParameters();
  }

  private *getParameters() {
    for (const param of this.node.parameters) {
      yield new AstParameterDeclaration(this.block, param);
    }
  }
}
