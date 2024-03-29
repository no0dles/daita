import { ExpressionDescription } from '../../expression-description';
import { isExactKind } from '@daita/common';

export interface LowerThanDescription<T> {
  lowerThan: ExpressionDescription<T>;
}

export const isLowerThanDescription = (val: any): val is LowerThanDescription<any> =>
  isExactKind<LowerThanDescription<any>>(val, ['lowerThan']);
