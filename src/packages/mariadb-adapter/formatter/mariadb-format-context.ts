import { SimpleFormatContext } from '../../relational/formatter/simple-format-context';
import { ValueType } from '../../relational/sql/operands/value-type';

export class MariadbFormatContext extends SimpleFormatContext {
  constructor() {
    super('?', '`');
  }

  appendValue(value: ValueType): string {
    this.values.push(value);
    return this.paramKey;
  }

  getDataType(type: string): string {
    switch (type) {
      case 'string':
        return 'TEXT';
      case 'number':
        return 'DECIMAL(26,10)';
      case 'date':
        return 'DATETIME';
      case 'boolean':
        return 'BOOLEAN';
      case 'uuid':
        return 'VARCHAR(36)';
    }

    throw new Error(`unknown data type ${type}`);
  }
}
