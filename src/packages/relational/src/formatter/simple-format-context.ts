import { FormatContext } from './format-context';
import { ValueType } from '../sql/operands/value-type';

export abstract class SimpleFormatContext implements FormatContext {
  protected values: ValueType[] = [];

  constructor(protected paramKey: string, protected escapeKey: string) {}

  appendValue(value: ValueType): string {
    this.values.push(value);
    return this.paramKey;
  }

  getValues(): ValueType[] {
    return this.values;
  }

  escape(value: string): string {
    return this.escapeKey + value + this.escapeKey;
  }
}
