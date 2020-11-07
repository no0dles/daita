import { FormatHandle, Formatter, FormatType } from '../../../formatter/formatter';
import { CreateTableSql, isCreateTableSql } from './create-table-sql';
import { FormatContext } from '../../../formatter/format-context';

export class CreateTableFormatter implements FormatHandle<CreateTableSql> {
  type = FormatType.Sql;

  canHandle(param: any): boolean {
    return isCreateTableSql(param);
  }

  handle(param: CreateTableSql, ctx: FormatContext, formatter: Formatter): string {
    let sql = 'CREATE TABLE';
    if (param.ifNotExists) {
      sql += ' IF NOT EXISTS';
    }
    sql += ` ${formatter.format(param.createTable, ctx)}`;
    sql += ` (${param.columns
      .map((col) => {
        let fieldSql = `${ctx.escape(col.name)} ${ctx.getDataType(col.type)}`;
        if (col.notNull) {
          fieldSql += ` NOT NULL`;
        }
        return fieldSql;
      })
      .join(', ')}`;

    const primaryKeys = param.columns.filter((col) => col.primaryKey).map((col) => ctx.escape(col.name));

    if (primaryKeys.length > 0) {
      sql += `, PRIMARY KEY (${primaryKeys.join(', ')})`;
    }

    sql += ')';

    return sql;
  }
}
