import { SqlRawValue } from '../dml';
import { isSqlSelect } from '../dml/select/sql-select';
import { Formatter, FormatterHandler } from './formatter';
import { isSqlInsert } from '../dml/insert/sql-insert';
import { FormatContext } from './format-context';

export interface InsertFormatterOptions {
  insertKeyword: string // "INSERT INTO";
  valuesKeyword: string // "VALUES";
}

export class InsertFormatter implements FormatterHandler {

  constructor(private options: InsertFormatterOptions) {
  }

  handle(param: any, ctx: FormatContext, formatter: Formatter): string | null {
    if (isSqlInsert(param)) {
      let sql = `${this.options.insertKeyword} ${formatter.format({ table: param.insert }, ctx)}`;

      const into: string[] = [];
      const rows: SqlRawValue[][] = [];

      if (param.values instanceof Array) {
        for (const item of param.values) {
          const row: SqlRawValue[] = [];
          const keys = Object.keys(item);
          for (const existingKey of into) {
            const value = item[existingKey];
            row.push(value);
            const index = keys.indexOf(existingKey as string);
            if (index !== -1) {
              keys.splice(index, 1);
            }
          }
          for (const key of keys) {
            into.push(key);
            row.push(item[key]);
          }
          rows.push(row);
        }
        sql += ` (${into.map((field) => formatter.format({ escape: field }, ctx)).join(', ')}) ${
          this.options.valuesKeyword
        } `;
        sql += rows
          .map(
            (row) =>
              `(${row.map((value) => formatter.format({ value }, ctx)).join(', ')})`,
          )
          .join(', ');
      } else if (isSqlSelect(param.values)) {
        sql += ' ' + formatter.format(param.values, ctx);
      } else {
        const keys = Object.keys(param.values);
        const values: SqlRawValue[] = [];
        for (const key of keys) {
          into.push(key);
          values.push((param.values as any)[key]);
        }
        rows.push(values);
        sql += ` (${into.map((field) => formatter.format({ escape: field }, ctx)).join(', ')}) ${
          this.options.valuesKeyword
        } `;
        sql += rows
          .map(
            (row) =>
              `(${row.map((value) => formatter.format({ value }, ctx)).join(', ')})`,
          )
          .join(', ');
      }

      return sql;
    }

    return null;
  }
}
