import { isExactKind } from '@daita/common';
import { ExpressionDescription } from './expression';

export interface GreaterThanDescription<T> {
  greaterThan: ExpressionDescription<T>;
}

export const isGreaterThanDescription = (val: any): val is GreaterThanDescription<any> => isExactKind<GreaterThanDescription<any>>(val, ['greaterThan']);

