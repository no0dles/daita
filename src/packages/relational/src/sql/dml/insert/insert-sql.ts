import { TableDescription } from '../../keyword/table/table-description';
import { SelectSql } from '../select/select-sql';
import { ExcludeNonPrimitive } from '@daita/common';
import { isKind } from '@daita/common';
import { ConditionDescription } from '../../operands';

export interface InsertSql<T> {
  insert: ExcludeNonPrimitive<T> | ExcludeNonPrimitive<T>[] | SelectSql<ExcludeNonPrimitive<T>>;
  into: TableDescription<T>;
  onConflict?: InsertOnConflict<T>;
}

export interface InsertOnConflict<T> {
  forField: keyof T | (keyof T)[];
  do: 'nothing' | InsertOnConflictDoUpdate<T>;
}

export interface InsertOnConflictDoUpdate<T> {
  set: Partial<T>;
  where?: ConditionDescription;
}

export const isInsertSql = (val: any): val is InsertSql<any> => isKind<InsertSql<any>>(val, ['insert', 'into']);
