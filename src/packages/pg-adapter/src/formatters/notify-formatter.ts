import { isNotifySql, PostgresNotifySql } from '../sql/notify-sql';
import { FormatContext } from '@daita/relational';
import { FormatHandle, Formatter, FormatType } from '@daita/relational';

export class NotifyFormatter implements FormatHandle<PostgresNotifySql> {
  type = FormatType.Sql;

  canHandle(param: any): boolean {
    return isNotifySql(param);
  }

  handle(param: PostgresNotifySql, ctx: FormatContext, formatter: Formatter): string {
    return `NOTIFY ${param.notify}${param.payload ? ` ${ctx.appendValue(param.payload)}` : ''}`;
  }
}
