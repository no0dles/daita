import { AstError, getType } from './utils';
import { AstBlock } from './ast-block';
import { UnionTypeNode } from 'typescript';
import { AstType } from './ast-type';
import { AstNode } from './ast-node';

export class AstUnionType implements AstNode {
  constructor(private block: AstBlock, public node: UnionTypeNode) {}

  get types(): Generator<AstType> {
    return this.getTypes();
  }

  private *getTypes() {
    for (const type of this.node.types) {
      const value = getType(this.block, type);
      if (!value) {
        throw new AstError(this.node, 'unknown type' + type);
      }
      yield value;
    }
  }
}
