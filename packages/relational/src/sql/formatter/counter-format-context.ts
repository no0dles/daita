import { SqlRawValue } from '../dml';
import { FormatContext } from './format-context';

export class CounterFormatContext implements FormatContext {
  private values: SqlRawValue[] = [];

  constructor(private prefix: string) {
  }

  appendValue(value: SqlRawValue): string {
    const index = this.values.indexOf(value);
    if (index === -1) {
      this.values.push(value);
      return `${this.prefix}${this.values.length}`;
    } else {
      return `${this.prefix}${index + 1}`;
    }
  }

  getValues(): SqlRawValue[] {
    return this.values;
  }
}
