import { CreateIndexSql, isCreateIndexSql } from '../../relational/sql/ddl/create-index/create-index-sql';
import { FormatContext } from '../../relational/formatter/format-context';
import { FormatHandle, Formatter, FormatType } from '../../relational/formatter/formatter';

export class CreateIndexFormatter implements FormatHandle<CreateIndexSql<any>> {
  type = [FormatType.Sql];

  canHandle(param: any): boolean {
    return isCreateIndexSql(param);
  }

  handle(param: CreateIndexSql<any>, ctx: FormatContext, formatter: Formatter): string {
    return `CREATE INDEX${param.unique ? ' UNIQUE' : ''} ${ctx.escape(param.createIndex)} ON ${formatter.format(
      param.on,
      ctx,
    )} (${param.columns.map((col) => ctx.escape(col as string)).join(', ')})`;
  }
}
