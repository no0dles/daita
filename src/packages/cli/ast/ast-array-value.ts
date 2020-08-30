import { AstBlock } from './ast-block';
import { ArrayLiteralExpression } from 'typescript';
import { getValueFromExpression } from './utils';
import { AstNode } from './ast-node';

export class AstArrayValue implements AstNode {
  constructor(private block: AstBlock,
              public node: ArrayLiteralExpression) {
  }

  get elements() {
    return this.getElements();
  }

  private* getElements() {
    for (const elem of this.node.elements) {
      yield getValueFromExpression(this.block, elem);
    }
  }
}
