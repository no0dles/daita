import {
  PropertyAssignment,
  ShorthandPropertyAssignment,
  Node,
} from 'typescript';
import { AstValue } from './ast-value';
import { AstBlock } from './ast-block';
import { AstError, getName, getValueFromExpression } from './utils';
import { AstNode } from './ast-node';

export abstract class AstObjectPropertyValue implements AstNode {
  abstract get name(): string;

  abstract get value(): AstValue | null;
  abstract node: Node;
}

export class AstObjectPropertyShorthandValue
  extends AstObjectPropertyValue
  implements AstNode {
  constructor(
    private block: AstBlock,
    public node: ShorthandPropertyAssignment,
  ) {
    super();
  }

  get name(): string {
    return getName(this.node.name, 'shorthand property assignment');
  }

  get value(): AstValue | null {
    const variable = this.block.variable(this.name);
    if (!variable) {
      throw new AstError(this.node, 'unable to find variable');
    }
    return variable.value;
  }
}

export class AstObjectPropertyAssignmentValue
  extends AstObjectPropertyValue
  implements AstNode {
  constructor(private block: AstBlock, public node: PropertyAssignment) {
    super();
  }

  get name(): string {
    return getName(this.node.name, 'property assignment');
  }

  get value(): AstValue | null {
    return getValueFromExpression(this.block, this.node.initializer);
  }
}
