import { isExactKind } from '../../../common/utils';
import { ExpressionDescription } from './expression';

export interface LowerThanDescription<T> {
  lowerThan: ExpressionDescription<T>;
}

export const isLowerThanDescription = (
  val: any,
): val is LowerThanDescription<any> =>
  isExactKind<LowerThanDescription<any>>(val, ['lowerThan']);
