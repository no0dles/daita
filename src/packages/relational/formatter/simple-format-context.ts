import { FormatContext } from './format-context';
import { ValueType } from '../sql/operands/value-type';

export abstract class SimpleFormatContext implements FormatContext {
  protected values: ValueType[] = [];

  constructor(protected paramKey: string) {}

  appendValue(value: ValueType): string {
    this.values.push(value);
    return this.paramKey;
  }

  getValues(): ValueType[] {
    return this.values;
  }

  escape(value: string): string {
    return '`' + value + '`';
  }

  abstract getDataType(type: string): string;
}
