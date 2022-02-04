import { TableDescription } from '../../keyword/table/table-description';
import { isKind } from '@daita/common';

export interface LockTableSql {
  lockTable: TableDescription<any>;
}

export const isLockTableSql = (val: any): val is LockTableSql => isKind<LockTableSql>(val, ['lockTable']);
