import { AstBlock } from './ast-block';
import { PropertyAccessExpression } from 'typescript';
import { AstError, getName, getValueFromExpression } from './utils';
import { AstEnumDeclaration } from './ast-enum-declaration';
import { AstValue } from './ast-value';
import { AstNode } from './ast-node';

export class AstPropertyAccessExpression implements AstNode {
  constructor(private block: AstBlock,
              public node: PropertyAccessExpression) {
  }

  get source() {
    return getValueFromExpression(this.block, this.node.expression);
  }

  get name() {
    return getName(this.node.name, 'property access expression');
  }

  get value(): AstValue {
    const source = this.source;

    if (!source) {
      throw new AstError(this.node, 'unknown source');
    }


    if (source instanceof AstEnumDeclaration) {
      const name = getName(this.node.name, 'property access expression');
      const member = source.member(name);
      if (!member) {
        throw new AstError(this.node, 'unknown enum member');
      }
      return member.value;
    }

    throw new AstError(this.node, 'unknown value');
  }
}
