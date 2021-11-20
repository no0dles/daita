import { ExpressionDescription } from '../../expression-description';
import { isExactKind } from '@daita/common';

export interface EqualDescription<T> {
  equal: ExpressionDescription<T>;
}

export const isEqualDescription = (val: any): val is EqualDescription<any> =>
  isExactKind<EqualDescription<any>>(val, ['equal']);
