import { FormatHandle, Formatter, FormatType } from '../../../formatter/formatter';
import { isLockTableSql, LockTableSql } from './lock-table-sql';
import { FormatContext } from '../../../formatter/format-context';

export class LockTableFormatter implements FormatHandle<LockTableSql> {
  type = FormatType.Sql;

  canHandle(param: any): boolean {
    return isLockTableSql(param);
  }

  handle(param: LockTableSql, ctx: FormatContext, formatter: Formatter): string {
    return `LOCK TABLE ${formatter.format(param.lockTable, ctx)}`;
  }
}
