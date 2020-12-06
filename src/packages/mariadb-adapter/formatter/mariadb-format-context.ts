import { SimpleFormatContext } from '../../relational/formatter/simple-format-context';
import { ValueType } from '../../relational/sql/operands/value-type';

export class MariadbFormatContext extends SimpleFormatContext {
  constructor() {
    super('?', '`');
  }

  appendValue(value: ValueType): string {
    if (value === undefined) {
      this.values.push(null);
    } else {
      this.values.push(value);
    }
    return this.paramKey;
  }

  getDataType(type: string): string {
    switch (type) {
      case 'string':
        return 'TEXT';
      case 'number':
        return 'DECIMAL(26,10)';
      case 'date':
        return 'DATETIME(3)';
      case 'boolean':
        return 'BOOLEAN';
      case 'uuid':
        return 'VARCHAR(36)';
      case 'string[]':
        return 'JSON';
    }

    if (type.startsWith('VARCHAR(')) {
      return type;
    }

    throw new Error(`unknown data type ${type}`);
  }
}
