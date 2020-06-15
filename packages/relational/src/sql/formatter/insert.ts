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

    if (isSelectSql(param.insert)) {
      sql += ` (${Object.keys(param.insert.select).map(field => ctx.escape(field)).join(', ')}) ` + formatter.format(param.insert, ctx);
    } else {
      const rows = param.insert instanceof Array ? param.insert : [param.insert];
      const fields = this.getValues(rows);
      sql += ` (${fields.map((field) => ctx.escape(field)).join(', ')}) VALUES `;
      sql += rows
        .map(
          (row) =>
            `(${fields.map(field => formatter.format(row[field], ctx)).join(', ')})`,
        )
        .join(', ');
    }

    return sql;
  }

  private getValues(items: ValueType[][]): string[] {
    const fields: string[] = [];
    for (const item of items) {
      for (const field of Object.keys(item)) {
        if (fields.indexOf(field) === -1) {
          fields.push(field);
        }
      }
    }

    return fields;
  }
}
