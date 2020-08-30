import { TableDescription } from './description/table';
import {isKind} from '../../common/utils';

export interface LockTableSql {
  lockTable: TableDescription<any>;
}

export const isLockTableSql = (val: any): val is LockTableSql => isKind<LockTableSql>(val, ['lockTable']);
