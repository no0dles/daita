import { isKind } from "@daita/common";
import { SqlTable } from '../../sql-table';

export interface SqlLockTableQuery {
  lockTable: SqlTable;
}

export const isSqlLockTableQuery = (val: any): val is SqlLockTableQuery => isKind<SqlLockTableQuery>(val, ['lockTable']);
