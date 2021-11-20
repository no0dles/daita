import { ExpressionDescription } from '../../expression-description';
import { isExactKind } from '@daita/common/utils/is-exact-kind';

export interface GreaterThanDescription<T> {
  greaterThan: ExpressionDescription<T>;
}

export const isGreaterThanDescription = (val: any): val is GreaterThanDescription<any> =>
  isExactKind<GreaterThanDescription<any>>(val, ['greaterThan']);
