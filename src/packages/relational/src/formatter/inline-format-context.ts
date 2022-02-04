import { FormatContext, FormatDataType } from './format-context';
import { ValueType } from '../sql/operands/value-type';

export class InlineFormatContext implements FormatContext {
  constructor(private baseFormatContext: FormatContext) {}

  appendValue(value: ValueType): string {
    if (typeof value === 'number') {
      return value.toString();
    } else if (typeof value === 'string') {
      return `'${value.replace(/'/g, "'")}'`;
    } else if (typeof value === 'boolean') {
      return value.toString().toUpperCase();
    } else if (value instanceof Date) {
      const date = `${value.getFullYear()}-${value.getMonth()}-${value.getDay()}`;
      const time = `${value.getHours().toString().padStart(2, '0')}:${value
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${value.getSeconds().toString().padStart(2, '0')}`;
      return `timestamp '${date} ${time}'`;
    } else if (value === undefined || value === null) {
      return 'NULL';
    }

    throw new Error('unknown value ' + value);
  }

  getValues(): ValueType[] {
    return [];
  }

  escape(value: string): string {
    return this.baseFormatContext.escape(value);
  }

  getDataType(type: FormatDataType): string {
    return this.baseFormatContext.getDataType(type);
  }

  restoreValue(type: FormatDataType, value: any): any {
    return value;
  }
}
