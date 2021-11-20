import { DropIndexSql, isDropIndexSql } from '@daita/relational/sql/ddl/drop-index/drop-index-sql';
import { FormatContext } from '@daita/relational/formatter/format-context';
import { FormatHandle, Formatter, FormatType } from '@daita/relational/formatter/formatter';

export class DropIndexFormatter implements FormatHandle<DropIndexSql> {
  type = [FormatType.Sql];

  canHandle(param: any): boolean {
    return isDropIndexSql(param);
  }

  handle(param: DropIndexSql, ctx: FormatContext, formatter: Formatter): string {
    return `DROP INDEX ${ctx.escape(param.dropIndex)}`;
  }
}
