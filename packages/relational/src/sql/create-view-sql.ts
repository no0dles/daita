import { TableDescription } from './description';
import { SelectSql } from './select-sql';
import { isKind } from '@daita/common';

export interface CreateViewSql<T> {
  createView: TableDescription<T>;
  orReplace?: boolean;
  as: SelectSql<T>;
}

export const isCreateViewSql = (val: any): val is CreateViewSql<any> => isKind<CreateViewSql<any>>(val, ['createView', 'as']);
