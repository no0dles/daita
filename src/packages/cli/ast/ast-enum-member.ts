import { getName, getTypeFromValue, getValueFromExpression } from './utils';
import { createNumericLiteral, EnumMember } from 'typescript';
import { AstValue } from './ast-value';
import { AstBlock } from './ast-block';
import { AstNumericLiteralValue } from './ast-literal-value';
import { AstType } from './ast-type';

export class AstEnumMember {
  constructor(
    private block: AstBlock,
    private node: EnumMember,
    private indexValue: number,
  ) {}

  get name() {
    return getName(this.node.name, 'enum member');
  }

  get type(): AstType | null {
    const value = this.value;
    if (value) {
      return getTypeFromValue(value);
    }
    return null;
  }

  get value(): AstValue {
    if (this.node.initializer) {
      return getValueFromExpression(this.block, this.node.initializer);
    } else {
      return new AstNumericLiteralValue(
        createNumericLiteral(this.indexValue.toString()),
      );
    }
  }
}
