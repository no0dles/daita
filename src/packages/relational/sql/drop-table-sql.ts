import { TableDescription } from './description/table';
import { isKind } from '../../common/utils/is-kind';

export interface DropTableSql {
  dropTable: TableDescription<any>;
  ifExists?: boolean;
}

export const isDropTableSql = (val: any): val is DropTableSql => isKind<DropTableSql>(val, ['dropTable']);
