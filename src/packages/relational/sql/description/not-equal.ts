import { ExpressionDescription } from './expression';
import { isExactKind } from '../../../common/utils/is-exact-kind';

export interface NotEqualDescription<T> {
  notEqual: ExpressionDescription<T>;
}

export const isNotEqualDescription = (val: any): val is NotEqualDescription<any> =>
  isExactKind<NotEqualDescription<any>>(val, ['notEqual']);
