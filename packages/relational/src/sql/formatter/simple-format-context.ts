import { SqlRawValue } from '../dml';
import { FormatContext } from './format-context';

export class SimpleFormatContext implements FormatContext {
  private values: SqlRawValue[] = [];

  constructor(private paramKey: string) {
  }

  appendValue(value: SqlRawValue): string {
    this.values.push(value);
    return this.paramKey;
  }

  getValues(): SqlRawValue[] {
    return this.values;
  }
}
