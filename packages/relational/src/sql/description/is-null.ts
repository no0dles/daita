import { isExactKind } from '@daita/common';
import { JoinDescription } from './join';

export interface IsNullDescription<T> {
  isNull: {field: T }
}

export const isNullDescription = (val: any): val is IsNullDescription<any> => isExactKind<IsNullDescription<any>>(val, ['isNull']);
