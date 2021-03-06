import { SimpleFormatContext } from '../../relational/formatter/simple-format-context';
import { ValueType } from '../../relational/sql/operands/value-type';
import { FormatDataType } from '../../relational/formatter/format-context';
import { isJsonDescription } from '../../relational/types/json/json-description';

export class SqliteFormatContext extends SimpleFormatContext {
  constructor() {
    super('?', '`');
  }

  restoreValue(options: FormatDataType, value: any) {
    if (options.type === 'date') {
      return new Date(value);
    } else if (options.type === 'boolean') {
      if (value === 0) {
        return true;
      } else if (value === 1) {
        return false;
      } else {
        return undefined;
      }
    } else {
      return value;
    }
  }

  appendValue(value: ValueType): string {
    if (value instanceof Date) {
      this.values.push('DATE-' + value.toISOString());
    } else if (typeof value === 'object') {
      this.values.push('JSON-' + JSON.stringify(value));
    } else if (typeof value === 'boolean') {
      this.values.push(`BOOL-${value}`);
    } else {
      this.values.push(value);
    }
    return this.paramKey;
  }

  getDataType(options: FormatDataType): string {
    switch (options.type) {
      case 'string':
        return 'TEXT';
      case 'number':
        return 'REAL';
      case 'date':
        return 'TEXT';
      case 'boolean':
        return 'TEXT';
      case 'string[]':
        return 'TEXT';
      case 'boolean[]':
        return 'TEXT';
      case 'number[]':
        return 'TEXT';
      case 'uuid':
        return 'TEXT';
      case 'json':
        return 'TEXT';
    }

    throw new Error(`unknown data type ${options.type}`);
  }
}
