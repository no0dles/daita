import { DropIndexSql, isDropIndexSql } from '../../relational/sql/drop-index-sql';
import { FormatContext } from '../../relational/sql/formatter/format-context';
import { FormatHandle, Formatter, FormatType } from '../../relational/sql/formatter/formatter';

export class DropIndexFormatter implements FormatHandle<DropIndexSql> {
  type = [FormatType.Sql];

  canHandle(param: any): boolean {
    return isDropIndexSql(param);
  }

  handle(param: DropIndexSql, ctx: FormatContext, formatter: Formatter): string {
    return `DROP INDEX ${ctx.escape(param.dropIndex)}`;
  }
}
