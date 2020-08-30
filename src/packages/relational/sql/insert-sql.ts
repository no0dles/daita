import { TableDescription } from './description/table';
import { SelectSql } from './select-sql';
import {ExcludeNonPrimitive} from '../../common/types';
import {isKind} from '../../common/utils';

export interface InsertSql<T> {
  insert: ExcludeNonPrimitive<T> | ExcludeNonPrimitive<T>[] | SelectSql<ExcludeNonPrimitive<T>>;
  into: TableDescription<T>;
}

export const isInsertSql = (val: any): val is InsertSql<any> => isKind<InsertSql<any>>(val, ['insert', 'into']);
