import { ValueType } from '../sql/operands/value-type';

export interface FormatDataType {
  type: string;
  size?: number;
}

export interface FormatContext {
  getValues(): ValueType[];
  escape(value: string): string;
  appendValue(value: ValueType): string;
  getDataType(options: FormatDataType): string;
}
