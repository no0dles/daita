import { LockTableSql } from '@daita/relational';

export interface MariadbLockTableSql extends LockTableSql {
  mode?: 'write' | 'read';
}
