import { isExactKind } from '../../common/utils/is-exact-kind';
import { TableDescription } from './description/table';

export interface DropIndexSql {
  dropIndex: string;
  on: TableDescription<any>;
}

export const isDropIndexSql = (val: any): val is DropIndexSql => isExactKind(val, ['dropIndex', 'on']);
