import { ExpressionDescription } from '../../expression-description';
import { isExactKind } from '@daita/common';

export interface GreaterEqualThanDescription<T> {
  greaterEqualThan: ExpressionDescription<T>;
}

export const isGreaterEqualThanDescription = (val: any): val is GreaterEqualThanDescription<any> =>
  isExactKind<GreaterEqualThanDescription<any>>(val, ['greaterEqualThan']);
