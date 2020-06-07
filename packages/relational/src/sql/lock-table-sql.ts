import { isKind } from '@daita/common';
import { TableDescription } from './description/table';

export interface LockTableSql {
  lockTable: TableDescription<any>;
}

export const isLockTableSql = (val: any): val is LockTableSql => isKind<LockTableSql>(val, ['lockTable']);
