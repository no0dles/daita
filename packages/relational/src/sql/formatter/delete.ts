import { FormatHandle, Formatter, FormatType } from './formatter';
import { DeleteSql, isDeleteSql } from '../delete-sql';
import { FormatContext } from './format-context';

export class DeleteFormatter implements FormatHandle<DeleteSql> {
  type = FormatType.Sql;

  canHandle(param: any): boolean {
    return isDeleteSql(param);
  }

  handle(param: DeleteSql, ctx: FormatContext, formatter: Formatter): string {
    let sql = `DELETE FROM ${formatter.format(param.delete, ctx)}`;

    if (param.where) {
      sql += ` WHERE ${formatter.format(param.where, ctx)}`;
    }

    return sql;
  }

}
