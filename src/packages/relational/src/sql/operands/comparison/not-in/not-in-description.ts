import { isExactKind } from '@daita/common';
import { SelectSql } from '../../../dml';

export interface NotInDescription<T> {
  notIn: { field: T; values: T[] | SelectSql<T> };
}

export const isNotInDescription = (val: any): val is NotInDescription<any> =>
  isExactKind<NotInDescription<any>>(val, ['notIn']);
