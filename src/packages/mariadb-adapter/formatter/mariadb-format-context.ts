import { SimpleFormatContext } from '../../relational/formatter/simple-format-context';
import { ValueType } from '../../relational/sql/operands/value-type';

export class MariadbFormatContext extends SimpleFormatContext {
  constructor() {
    super('?');
  }

  appendValue(value: ValueType): string {
    this.values.push(value);
    return this.paramKey;
  }

  getDataType(type: string): string {
    switch (type) {
      case 'string':
        return 'VARCHAR';
      case 'number':
        return 'DECIMAL';
      case 'date':
        return 'DATETIME';
      case 'boolean':
        return 'BOOLEAN';
      case 'uuid':
        return 'TEXT';
    }

    throw new Error(`unknown data type ${type}`);
  }
}
