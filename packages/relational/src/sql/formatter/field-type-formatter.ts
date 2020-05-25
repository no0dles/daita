import { Formatter, FormatterHandler } from './formatter';
import { isKind } from '@daita/common';
import { FormatContext } from './format-context';

export interface FormatFieldType {
  fieldType: any;
}

export interface FieldTypeFormatterOptions<TFieldType> {
  formatFieldType(fieldType: TFieldType): string;
}

export class FieldTypeFormatter<TFieldType> implements FormatterHandler {
  constructor(private options: FieldTypeFormatterOptions<TFieldType>) {
  }

  handle(param: any, ctx: FormatContext, formatter: Formatter): string | null {
    if (isKind<FormatFieldType>(param, ['fieldType'])) {
      const result = this.options.formatFieldType(param.fieldType);
      if (!result) {
        throw new Error(`unknown field type ${param.fieldType}`);
      }
      return result;
    }

    return null;
  }
}
