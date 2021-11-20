import { AstParameterDeclaration } from './ast-parameter-declaration';
import { AstError, getName, hasModifier } from './utils';
import { AstBlock } from './ast-block';
import { FunctionDeclaration, SyntaxKind } from 'typescript';
import { AstNode } from './ast-node';

export class AstFunctionDeclaration implements AstNode {
  constructor(public block: AstBlock, public node: FunctionDeclaration) {}

  get name(): string {
    if (!this.node.name) {
      throw new AstError(this.node, 'missing function name');
    }
    return getName(this.node.name, 'function declaration');
  }

  get parameters(): Generator<AstParameterDeclaration> {
    return this.getParameters();
  }

  get exported(): boolean {
    return hasModifier(this.node.modifiers, SyntaxKind.ExportKeyword);
  }

  private *getParameters() {
    for (const param of this.node.parameters) {
      yield new AstParameterDeclaration(this.block, param);
    }
  }
}
