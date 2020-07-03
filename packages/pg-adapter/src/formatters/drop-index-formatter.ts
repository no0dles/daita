import {
  DropIndexSql,
  FormatContext,
  FormatHandle,
  Formatter,
  FormatType,
  isDropIndexSql,
} from '@daita/relational';

export class DropIndexFormatter implements FormatHandle<DropIndexSql> {
  type = [FormatType.Sql];

  canHandle(param: any): boolean {
    return isDropIndexSql(param);
  }

  handle(param: DropIndexSql, ctx: FormatContext, formatter: Formatter): string {
    return `DROP INDEX ${ctx.escape(param.dropIndex)}`;
  }

}
