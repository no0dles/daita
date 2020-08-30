import {isExactKind} from '../../../common/utils';

export interface BetweenDescription<T> {
  between: { value: T, min: T, max: T };
}

export const isBetweenDescription = (val: any): val is BetweenDescription<any> => isExactKind(val, ['between']);
