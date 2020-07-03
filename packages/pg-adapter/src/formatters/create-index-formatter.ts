import {
  CreateIndexSql,
  FormatContext,
  FormatHandle,
  Formatter,
  FormatType,
  isCreateIndexSql,
} from '@daita/relational';

export class CreateIndexFormatter implements FormatHandle<CreateIndexSql<any>> {
  type = [FormatType.Sql];

  canHandle(param: any): boolean {
    return isCreateIndexSql(param);
  }

  handle(param: CreateIndexSql<any>, ctx: FormatContext, formatter: Formatter): string {
    return `CREATE INDEX${param.unique ? ' UNIQUE' : ''} ${ctx.escape(param.createIndex)} ON ${formatter.format(param.on, ctx)} (${param.columns.map(col => ctx.escape(col as string)).join(', ')})`;
  }

}
