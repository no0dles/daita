import { isListenSql, PostgresListenSql } from '../sql/listen-sql';
import { FormatContext } from '../../relational/sql/formatter/format-context';
import { FormatHandle, Formatter, FormatType } from '../../relational/sql/formatter/formatter';

export class ListenFormatter implements FormatHandle<PostgresListenSql> {
  type = FormatType.Sql;

  canHandle(param: any): boolean {
    return isListenSql(param);
  }

  handle(param: PostgresListenSql, ctx: FormatContext, formatter: Formatter): string {
    return `LISTEN ${param.listen}`;
  }
}
