import { isExactKind } from '@daita/common';
import { ExpressionDescription } from './expression';

export interface GreaterEqualThanDescription<T> {
  greaterEqualThan: ExpressionDescription<T>;
}

export const isGreaterEqualThanDescription = (val: any): val is GreaterEqualThanDescription<any> => isExactKind<GreaterEqualThanDescription<any>>(val, ['greaterEqualThan']);

