import { Formatter, FormatterHandler } from './formatter';
import { isKind } from '@daita/common';
import { FormatContext } from './format-context';

export interface FormatSchemaTableField {
  schema?: string;
  table?: string;
  field?: string;
  alias?: string;
  all?: true
}

export interface FieldFormatterOptions {
  allKeyword: string;
}

export interface FormatField {
  field: FormatSchemaTableField;
}

export class FieldFormatter implements FormatterHandler {
  constructor(private options: FieldFormatterOptions) {
  }

  handle(param: any, ctx: FormatContext, formatter: Formatter) {
    if (isKind<FormatField>(param, ['field'])) {
      let sql = '';
      if (param.field.schema) {
        sql += formatter.format({ escape: param.field.schema }, ctx);
      }
      if (param.field.table) {
        sql += (sql.length > 0 ? '.' : '') + formatter.format({ escape: param.field.table }, ctx);
      }
      if (param.field.field) {
        sql += (sql.length > 0 ? '.' : '') + formatter.format({ escape: param.field.field }, ctx);
      }
      if (param.field.all) {
        sql += (sql.length > 0 ? '.' : '') + this.options.allKeyword;
      }
      if (param.field.alias) {
        sql = formatter.format({ alias: { name: param.field.alias, value: sql } }, ctx);
      }
      return sql;
    }

    return null;
  }
}
