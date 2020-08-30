import { FormatContext } from './format-context';
import { ValueType } from '../description/value-type';

export abstract class CounterFormatContext implements FormatContext {
  private values: ValueType[] = [];

  constructor(private prefix: string) {
  }

  appendValue(value: ValueType): string {
    const index = this.values.indexOf(value);
    if (index === -1) {
      this.values.push(value);
      return `${this.prefix}${this.values.length}`;
    } else {
      return `${this.prefix}${index + 1}`;
    }
  }

  getValues(): ValueType[] {
    return this.values;
  }

  escape(value: string): string {
    return `"${value}"`;
  }

  abstract getDataType(type: string): string;
}
