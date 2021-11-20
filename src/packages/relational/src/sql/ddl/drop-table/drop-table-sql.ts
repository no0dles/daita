import { TableDescription } from '../../keyword/table/table-description';
import { isKind } from '@daita/common';

export interface DropTableSql {
  dropTable: TableDescription<any>;
  ifExists?: boolean;
}

export const isDropTableSql = (val: any): val is DropTableSql => isKind<DropTableSql>(val, ['dropTable']);
