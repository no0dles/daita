import { DropIndexSql, isDropIndexSql } from '@daita/relational';
import { FormatContext } from '@daita/relational';
import { FormatHandle, Formatter, FormatType } from '@daita/relational';

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
