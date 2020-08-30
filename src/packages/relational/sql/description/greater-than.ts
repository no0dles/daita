import { isExactKind } from '../../../common/utils';
import { ExpressionDescription } from './expression';

export interface GreaterThanDescription<T> {
  greaterThan: ExpressionDescription<T>;
}

export const isGreaterThanDescription = (
  val: any,
): val is GreaterThanDescription<any> =>
  isExactKind<GreaterThanDescription<any>>(val, ['greaterThan']);
