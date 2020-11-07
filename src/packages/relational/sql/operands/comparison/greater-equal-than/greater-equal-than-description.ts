import { ExpressionDescription } from '../../expression-description';
import { isExactKind } from '../../../../../common/utils/is-exact-kind';

export interface GreaterEqualThanDescription<T> {
  greaterEqualThan: ExpressionDescription<T>;
}

export const isGreaterEqualThanDescription = (val: any): val is GreaterEqualThanDescription<any> =>
  isExactKind<GreaterEqualThanDescription<any>>(val, ['greaterEqualThan']);
