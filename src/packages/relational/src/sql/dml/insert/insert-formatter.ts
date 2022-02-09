import { FormatHandle, Formatter, FormatType } from '../../../formatter/formatter';
import { InsertSql, isInsertSql } from './insert-sql';
import { FormatContext } from '../../../formatter/format-context';
import { ValueType } from '../../operands/value-type';
import { isSelectSql } from '../select/select-sql';

export class InsertFormatter implements FormatHandle<InsertSql<any>> {
  type = FormatType.Sql;

  canHandle(param: any): boolean {
    return isInsertSql(param);
  }

  handle(param: InsertSql<any>, ctx: FormatContext, formatter: Formatter): string {
    let sql = `INSERT INTO ${formatter.format(param.into, ctx)}`;

    if (isSelectSql(param.insert)) {
      sql +=
        ` (${Object.keys(param.insert.select)
          .map((field) => ctx.escape(field))
          .join(', ')}) ` + formatter.format(param.insert, ctx);
    } else {
      const rows: any[] = param.insert instanceof Array ? param.insert : [param.insert];
      const fields = this.getValues(rows);
      sql += ` (${fields.map((field) => ctx.escape(field)).join(', ')}) VALUES `;
      sql += rows.map((row) => `(${fields.map((field) => formatter.format(row[field], ctx)).join(', ')})`).join(', ');
    }

    if (param.onConflict) {
      const fields =
        param.onConflict.forField instanceof Array
          ? param.onConflict.forField.join(', ')
          : String(param.onConflict.forField);
      sql += ` ON CONFLICT (${fields})`;

      if (param.onConflict.do === 'nothing') {
        sql += ` DO NOTHING`;
      } else {
        const set = param.onConflict.do.set;
        const sets = Object.keys(set)
          .map((key) => `${ctx.escape(key)} = ${formatter.format(set[key], ctx)}`)
          .join(', ');
        sql += ` DO UPDATE SET ${sets}`;
        if (param.onConflict.do.where) {
          sql += ` WHERE ${formatter.format(param.onConflict.do.where, ctx)}`;
        }
      }
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
