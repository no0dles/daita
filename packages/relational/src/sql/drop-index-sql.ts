import { TableDescription } from './description';
import { isExactKind } from '@daita/common';

export interface DropIndexSql {
  dropIndex: string;
  on: TableDescription<any>;
}

export const isDropIndexSql = (val: any): val is DropIndexSql => isExactKind(val, ['dropIndex', 'on']);
