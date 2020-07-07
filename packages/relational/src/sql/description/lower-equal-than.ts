import { isExactKind } from '@daita/common';
import { ExpressionDescription } from './expression';

export interface LowerEqualThanDescription<T> {
  lowerEqualThan: ExpressionDescription<T>;
}

export const isLowerEqualThanDescription = (val: any): val is LowerEqualThanDescription<any> => isExactKind<LowerEqualThanDescription<any>>(val, ['lowerEqualThan']);

