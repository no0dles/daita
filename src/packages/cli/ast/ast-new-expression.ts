import { NewExpression } from 'typescript';
import { getName, getValueFromExpression } from './utils';
import { AstBlock } from './ast-block';
import { AstNode } from './ast-node';
import { AstValue } from './ast-value';

export class AstNewExpression implements AstNode {
  constructor(private block: AstBlock, public node: NewExpression) {}

  get type() {
    const name = getName(this.node.expression, 'new expression');
    return this.block.class(name);
  }

  get arguments() {
    return this.getArguments();
  }

  argumentAt(index: number): AstValue | null {
    let i = 0;
    for (const argument of this.getArguments()) {
      if (i === index) {
        return argument;
      }
      i++;
    }
    return null;
  }

  private *getArguments() {
    if (!this.node.arguments) {
      return;
    }

    for (const arg of this.node.arguments) {
      yield getValueFromExpression(this.block, arg);
    }
  }
}
