import { ExpressionDescription } from '../../expression-description';
import { isExactKind } from '../../../../../common/utils/is-exact-kind';

export interface EqualDescription<T> {
  equal: ExpressionDescription<T>;
}

export const isEqualDescription = (val: any): val is EqualDescription<any> =>
  isExactKind<EqualDescription<any>>(val, ['equal']);
