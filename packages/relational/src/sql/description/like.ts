import { ExpressionDescription } from './expression';
import { isExactKind } from '@daita/common';

export interface LikeDescription<T> {
  like: ExpressionDescription<T>;
}
export const isLikeDescription = (val: any): val is LikeDescription<any> => isExactKind<LikeDescription<any>>(val, ['like']);

