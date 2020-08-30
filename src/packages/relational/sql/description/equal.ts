import { ExpressionDescription } from './expression';
import { isExactKind } from '../../../common/utils';

export interface EqualDescription<T> {
  equal: ExpressionDescription<T>;
}

export const isEqualDescription = (val: any): val is EqualDescription<any> =>
  isExactKind<EqualDescription<any>>(val, ['equal']);
