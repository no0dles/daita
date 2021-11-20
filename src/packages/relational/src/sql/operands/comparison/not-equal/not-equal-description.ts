import { ExpressionDescription } from '../../expression-description';
import { isExactKind } from '@daita/common';

export interface NotEqualDescription<T> {
  notEqual: ExpressionDescription<T>;
}

export const isNotEqualDescription = (val: any): val is NotEqualDescription<any> =>
  isExactKind<NotEqualDescription<any>>(val, ['notEqual']);
