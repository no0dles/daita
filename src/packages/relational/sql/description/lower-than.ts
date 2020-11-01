import { ExpressionDescription } from './expression';
import { isExactKind } from '../../../common/utils/is-exact-kind';

export interface LowerThanDescription<T> {
  lowerThan: ExpressionDescription<T>;
}

export const isLowerThanDescription = (val: any): val is LowerThanDescription<any> =>
  isExactKind<LowerThanDescription<any>>(val, ['lowerThan']);
