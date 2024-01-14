import { FormatHandle, Formatter, FormatType } from '../../../formatter/formatter';
import { isUpdateSql, UpdateSql } from './update-sql';
import { FormatContext } from '../../../formatter/format-context';

export class UpdateFormatter implements FormatHandle<UpdateSql<any>> {
  type = [FormatType.Sql];

  canHandle(param: any): boolean {
    return isUpdateSql(param);
  }

  handle(param: UpdateSql<any>, ctx: FormatContext, formatter: Formatter): string {
    let sql = `UPDATE ${formatter.format(param.update, ctx)} SET `;

    if (param.set) {
      sql += Object.keys(param.set)
        .map((key) => {
          return `${ctx.escape(key)} = ${formatter.format(param.set[key], ctx)}`;
        })
        .join(', ');
    }

    if (param.where) {
      sql += ` WHERE ${formatter.format(param.where, ctx)}`;
    }

    return sql;
  }
}
