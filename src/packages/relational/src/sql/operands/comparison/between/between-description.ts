import { isExactKind } from '@daita/common/utils/is-exact-kind';

export interface BetweenDescription<T> {
  between: { value: T; min: T; max: T };
}

export const isBetweenDescription = (val: any): val is BetweenDescription<any> => isExactKind(val, ['between']);
