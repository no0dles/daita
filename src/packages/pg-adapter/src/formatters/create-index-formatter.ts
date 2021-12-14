import { CreateIndexSql, isCreateIndexSql } from '@daita/relational';
import { FormatContext } from '@daita/relational';
import { FormatHandle, Formatter, FormatType } from '@daita/relational';

export class CreateIndexFormatter implements FormatHandle<CreateIndexSql<any>> {
  type = [FormatType.Sql];

  canHandle(param: any): boolean {
    return isCreateIndexSql(param);
  }

  handle(param: CreateIndexSql<any>, ctx: FormatContext, formatter: Formatter): string {
    return `CREATE${param.unique ? ' UNIQUE' : ''} INDEX ${ctx.escape(param.createIndex)} ON ${formatter.format(
      param.on,
      ctx,
    )} (${param.columns.map((col) => ctx.escape(col as string)).join(', ')})`;
  }
}
