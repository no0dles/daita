import { DropIndexSql, isDropIndexSql } from './drop-index-sql';
import { FormatContext, FormatHandle, Formatter, FormatType } from '../../../formatter';

export class DropIndexFormatter implements FormatHandle<DropIndexSql> {
  type = [FormatType.Sql];

  canHandle(param: any): boolean {
    return isDropIndexSql(param);
  }

  handle(param: DropIndexSql, ctx: FormatContext, formatter: Formatter): string {
    if (param.on && param.on.schema) {
      return `DROP INDEX ${ctx.escape(param.on.schema)}.${ctx.escape(param.dropIndex)}`;
    } else {
      return `DROP INDEX ${ctx.escape(param.dropIndex)}`;
    }
  }
}
