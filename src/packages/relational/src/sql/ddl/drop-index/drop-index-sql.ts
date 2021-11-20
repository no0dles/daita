import { isExactKind } from '@daita/common/utils/is-exact-kind';
import { TableDescription } from '../../keyword/table/table-description';

export interface DropIndexSql {
  dropIndex: string;
  on: TableDescription<any>;
}

export const isDropIndexSql = (val: any): val is DropIndexSql => isExactKind(val, ['dropIndex', 'on']);
