import {
  FormatContext,
  FormatHandle,
  Formatter,
  FormatType,
} from '../../relational/sql/formatter';
import { isListenSql, PostgresListenSql } from '../sql/listen-sql';

export class ListenFormatter implements FormatHandle<PostgresListenSql> {
  type = FormatType.Sql;

  canHandle(param: any): boolean {
    return isListenSql(param);
  }

  handle(
    param: PostgresListenSql,
    ctx: FormatContext,
    formatter: Formatter,
  ): string {
    return `LISTEN ${param.listen}`;
  }
}
