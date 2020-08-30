import { SpreadElement } from 'typescript';
import { AstBlock } from './ast-block';
import { AstNode } from './ast-node';
import { getValueFromExpression } from './utils';

export class AstSpreadElement implements AstNode {
  constructor(private block: AstBlock, public node: SpreadElement) {}

  get value() {
    return getValueFromExpression(this.block, this.node.expression);
  }
}
