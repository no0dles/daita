import { isLockTableSql, LockTableSql } from '../../relational/sql/ddl/lock-table/lock-table-sql';
import { FormatContext } from '../../relational/formatter/format-context';
import { FormatHandle, Formatter, FormatType } from '../../relational/formatter/formatter';
import { MariadbLockTableSql } from '../sql/mariadb-lock-table';

export class LockTableFormatter implements FormatHandle<MariadbLockTableSql> {
  type = FormatType.Sql;

  canHandle(param: any): boolean {
    return isLockTableSql(param);
  }

  handle(param: MariadbLockTableSql, ctx: FormatContext, formatter: Formatter): string {
    return `LOCK TABLE ${formatter.format(param.lockTable, ctx)} ${(param.mode || 'write').toUpperCase()}`;
  }
}
