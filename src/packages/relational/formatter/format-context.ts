import { ValueType } from '../sql/operands/value-type';

export interface FormatContext {
  getValues(): ValueType[];
  escape(value: string): string;
  appendValue(value: ValueType): string;
  getDataType(type: string): string;
}
