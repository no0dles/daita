import { isExactKind } from '@daita/common';

export interface IsNotNullDescription<T> {
  isNotNull: { field: T };
}

export const isNotNullDescription = (val: any): val is IsNotNullDescription<any> =>
  isExactKind<IsNotNullDescription<any>>(val, ['isNotNull']);
