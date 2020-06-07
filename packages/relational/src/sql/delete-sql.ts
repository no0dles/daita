import { Condition } from './description/condition';
import { isKind } from '@daita/common';
import { TableDescription } from './description/table';

export interface DeleteSql {
  delete: TableDescription<any>;
  where?: Condition;
}

export const isDeleteSql = (val: any): val is DeleteSql => isKind<DeleteSql>(val, ['delete']);
