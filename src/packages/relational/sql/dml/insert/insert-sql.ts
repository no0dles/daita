import { TableDescription } from '../../keyword/table/table-description';
import { SelectSql } from '../select/select-sql';
import { ExcludeNonPrimitive } from '../../../../common/types/exclude-non-primitive';
import { isKind } from '../../../../common/utils/is-kind';

export interface InsertSql<T> {
  insert: ExcludeNonPrimitive<T> | ExcludeNonPrimitive<T>[] | SelectSql<ExcludeNonPrimitive<T>>;
  into: TableDescription<T>;
}

export const isInsertSql = (val: any): val is InsertSql<any> => isKind<InsertSql<any>>(val, ['insert', 'into']);
