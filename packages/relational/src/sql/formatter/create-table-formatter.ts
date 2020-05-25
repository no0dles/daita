import { isSqlCreateTable } from '../ddl/create-table/create-table-query';
import { Formatter, FormatterHandler } from './formatter';
import { FormatContext } from './format-context';

export interface CreateTableFormatterOptions {
  createTableKeyword: string; // "CREATE TABLE";
  ifNotExistsKeyword: string; // "IF NOT EXISTS";
  notNullKeyword: string; // "NOT NULL";
  primaryKeyKeyword: string; // "PRIMARY KEY";
}

export class CreateTableFormatter implements FormatterHandler {

  constructor(private options: CreateTableFormatterOptions) {
  }

  handle(param: any, ctx: FormatContext, formatter: Formatter): string | null {
    if (isSqlCreateTable(param)) {
      let sql = this.options.createTableKeyword;
      if (param.ifNotExist) {
        sql += ` ${this.options.ifNotExistsKeyword}`;
      }
      sql += ` ${formatter.format({ table: param.createTable }, ctx)}`;

      sql += ` (${param.fields
        .map((field) => {
          let fieldSql = `${formatter.format({ escape: field.name }, ctx)} ${formatter.format({ fieldType: field.type }, ctx)}`;
          if (field.notNull) {
            fieldSql += ` ${this.options.notNullKeyword}`;
          }
          return fieldSql;
        })
        .join(', ')}`;

      const primaryKeys = param.fields
        .filter((field) => field.primaryKey)
        .map((field) => formatter.format({escape: field.name}, ctx));

      if (primaryKeys.length > 0) {
        sql += `, ${this.options.primaryKeyKeyword} (${primaryKeys.join(', ')})`;
      }

      sql += ')';

      return sql;
    }

    return null;
  }
}
