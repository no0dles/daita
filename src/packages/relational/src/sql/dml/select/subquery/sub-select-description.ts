import { SelectSql } from '../select-sql';
import { isExactKind } from '@daita/common';

export interface SubSelectDescription<T> {
  subSelect: SelectSql<T>;
}

export const isSubSelectDescription = (val: any): val is SubSelectDescription<any> =>
  isExactKind<SubSelectDescription<any>>(val, ['subSelect']);
