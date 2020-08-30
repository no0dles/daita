import { AstType } from './ast-type';
import { AstBlock } from './ast-block';
import { TypeReferenceNode } from 'typescript';
import { getName } from './utils';
import { AstNode } from './ast-node';

export class AstReferenceType implements AstNode {
  constructor(private block: AstBlock, public node: TypeReferenceNode) {}

  get referenceType(): AstType | null {
    return this.block.getType(this.node.typeName);
  }

  get name() {
    return getName(this.node.typeName, 'type reference node');
  }
}
