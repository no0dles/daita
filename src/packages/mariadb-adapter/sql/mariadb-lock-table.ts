import { LockTableSql } from '../../relational/sql/ddl/lock-table/lock-table-sql';

export interface MariadbLockTableSql extends LockTableSql {
  mode?: 'write' | 'read';
}
