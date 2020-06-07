import { Condition } from './description/condition';
import { isKind } from '@daita/common';
import { TableDescription } from './description/table';

export interface UpdateSql<T> {
  update: TableDescription<T>;
  set: Partial<T>;
  where?: Condition;
}

export const isUpdateSql = (val: any): val is UpdateSql<any> => isKind<UpdateSql<any>>(val, ['update', 'set']);
