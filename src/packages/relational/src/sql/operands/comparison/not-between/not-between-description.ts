import { isExactKind } from '@daita/common/utils/is-exact-kind';

export interface NotBetweenDescription<T> {
  notBetween: { value: T; min: T; max: T };
}

export const isNotBetweenDescription = (val: any): val is NotBetweenDescription<any> =>
  isExactKind<NotBetweenDescription<any>>(val, ['notBetween']);
