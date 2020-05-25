import { Formatter, FormatterHandler } from './formatter';
import { FormatContext } from './format-context';
import { isSqlCreateSchemaQuery } from '../ddl/create-schema/create-schema-query';

export interface CreateSchemaFormatterOptions {
  createSchemaKeyword: string; // "CREATE SCHEMA";
  ifNotExistsKeyword: string; // "IF NOT EXISTS";
}

export class CreateSchemaFormatter implements FormatterHandler {

  constructor(private options: CreateSchemaFormatterOptions) {
  }

  handle(param: any, ctx: FormatContext, formatter: Formatter): string | null {
    if (isSqlCreateSchemaQuery(param)) {
      let sql = this.options.createSchemaKeyword;
      if (param.ifNotExists) {
        sql += ` ${this.options.ifNotExistsKeyword}`;
      }

      sql += ` ${formatter.format({escape: param.createSchema}, ctx)}`;

      return sql;
    }

    return null;
  }
}
