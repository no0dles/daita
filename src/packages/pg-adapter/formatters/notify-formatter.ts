import {
  FormatContext,
  FormatHandle,
  Formatter,
  FormatType,
} from '../../relational/sql/formatter';
import { isNotifySql, PostgresNotifySql } from '../sql/notify-sql';

export class NotifyFormatter implements FormatHandle<PostgresNotifySql> {
  type = FormatType.Sql;

  canHandle(param: any): boolean {
    return isNotifySql(param);
  }

  handle(
    param: PostgresNotifySql,
    ctx: FormatContext,
    formatter: Formatter,
  ): string {
    return `NOTIFY ${param.notify}${
      param.payload ? ` ${ctx.appendValue(param.payload)}` : ''
    }`;
  }
}
