import { SimpleFormatContext } from '../../relational/formatter/simple-format-context';
import { ValueType } from '../../relational/sql/operands/value-type';

export class SqliteFormatContext extends SimpleFormatContext {
  constructor() {
    super('?', '`');
  }

  appendValue(value: ValueType): string {
    if (value instanceof Date) {
      this.values.push(value.toISOString());
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
        return 'REAL';
      case 'date':
        return 'TEXT';
      case 'boolean':
        return 'INTEGER';
      case 'string[]':
        return 'TEXT';
      case 'boolean[]':
        return 'TEXT';
      case 'number[]':
        return 'TEXT';
      case 'uuid':
        return 'TEXT';
    }

    throw new Error(`unknown data type ${type}`);
  }
}
