import { ExpressionDescription } from '../../expression-description';
import { isExactKind } from '@daita/common/utils/is-exact-kind';

export interface LikeDescription<T> {
  like: ExpressionDescription<T>;
}
export const isLikeDescription = (val: any): val is LikeDescription<any> =>
  isExactKind<LikeDescription<any>>(val, ['like']);
