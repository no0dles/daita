import { isExactKind } from '@daita/common';
import { SelectSql } from '../../../dml';

export interface InDescription<T> {
  in: {
    field: T;
    values: T[] | SelectSql<T>;
  };
}

export const isInDescription = (val: any): val is InDescription<any> => isExactKind<InDescription<any>>(val, ['in']);
