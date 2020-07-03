import { ExcludeNonPrimitive, isKind } from '@daita/common';
import { TableDescription } from './description/table';
import { SelectSql } from './select-sql';

export interface InsertSql<T> {
  insert: ExcludeNonPrimitive<T> | ExcludeNonPrimitive<T>[] | SelectSql<ExcludeNonPrimitive<T>>;
  into: TableDescription<T>;
}

export const isInsertSql = (val: any): val is InsertSql<any> => isKind<InsertSql<any>>(val, ['insert', 'into']);
