import { AstBlock } from './ast-block';
import { ArrayTypeNode } from 'typescript';
import { getType } from './utils';
import { AstNode } from './ast-node';

export class AstArrayType implements AstNode {
  constructor(private block: AstBlock,
              public node: ArrayTypeNode) {
  }

  get elementType() {
    return getType(this.block, this.node.elementType);
  }
}
