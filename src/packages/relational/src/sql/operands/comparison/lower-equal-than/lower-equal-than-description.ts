import { ExpressionDescription } from '../../expression-description';
import { isExactKind } from '@daita/common';

export interface LowerEqualThanDescription<T> {
  lowerEqualThan: ExpressionDescription<T>;
}

export const isLowerEqualThanDescription = (val: any): val is LowerEqualThanDescription<any> =>
  isExactKind<LowerEqualThanDescription<any>>(val, ['lowerEqualThan']);
