import { FormatHandle, Formatter, FormatType } from './formatter';
import { DropTableSql, isDropTableSql } from '../drop-table-sql';
import { FormatContext } from './format-context';

export class DropTableFormatter implements FormatHandle<DropTableSql> {
  type = FormatType.Sql;

  canHandle(param: any): boolean {
    return isDropTableSql(param);
  }

  handle(param: DropTableSql, ctx: FormatContext, formatter: Formatter): string {
    let sql = 'DROP TABLE';
    if (param.ifExists) {
      sql += ' IF EXISTS';
    }
    sql += ` ${formatter.format(param.dropTable, ctx)}`;
    return sql;
  }
}
