import { isLockTableSql } from '@daita/relational';
import { FormatContext } from '@daita/relational';
import { FormatHandle, Formatter, FormatType } from '@daita/relational';
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
