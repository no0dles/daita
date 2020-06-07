import { FormatHandle, Formatter, FormatType } from './formatter';
import { InsertSql, isInsertSql } from '../insert-sql';
import { FormatContext } from './format-context';
import { ValueType } from '../description/value-type';
import { isSelectSql } from '../select-sql';

export class InsertFormatter implements FormatHandle<InsertSql<any>> {
  type = FormatType.Sql;

  canHandle(param: any): boolean {
    return isInsertSql(param);
  }

  handle(param: InsertSql<any>, ctx: FormatContext, formatter: Formatter): string {
    let sql = `INSERT INTO ${formatter.format(param.into, ctx)}`;

    const into: string[] = [];
    const rows: ValueType[][] = [];

    if (param.insert instanceof Array) {
      for (const item of param.insert) {
        const row: ValueType[] = [];
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
      sql += ` (${into.map((field) => ctx.escape(field)).join(', ')}) VALUES `;
      sql += rows
        .map(
          (row) =>
            `(${row.map((value) => formatter.format(value, ctx)).join(', ')})`,
        )
        .join(', ');
    } else if (isSelectSql(param.insert)) {
      sql += ' ' + formatter.format(param.insert, ctx);
    } else {
      const keys = Object.keys(param.insert);
      const values: ValueType[] = [];
      for (const key of keys) {
        into.push(key);
        values.push((param.insert as any)[key]);
      }
      rows.push(values);
      sql += ` (${into.map((field) => ctx.escape(field)).join(', ')}) VALUES `;
      sql += rows
        .map(
          (row) =>
            `(${row.map((value) => formatter.format(value, ctx)).join(', ')})`,
        )
        .join(', ');
    }

    return sql;
  }

}
