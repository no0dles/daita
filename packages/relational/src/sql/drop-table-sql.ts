import { isKind } from '@daita/common';
import { TableDescription } from './description/table';

export interface DropTableSql {
  dropTable: TableDescription<any>;
  ifExists?: boolean;
}

export const isDropTableSql = (val: any): val is DropTableSql => isKind<DropTableSql>(val, ['dropTable']);
