import { FormatContext } from './format-context';
import { ValueType } from '../description/value-type';

export class SimpleFormatContext implements FormatContext {
  private values: ValueType[] = [];

  constructor(private paramKey: string) {
  }

  appendValue(value: ValueType): string {
    this.values.push(value);
    return this.paramKey;
  }

  getValues(): ValueType[] {
    return this.values;
  }

  escape(value: string): string {
    return '`';
  }
}
