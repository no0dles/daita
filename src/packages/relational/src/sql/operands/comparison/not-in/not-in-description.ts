import { isExactKind } from '@daita/common/utils/is-exact-kind';

export interface NotInDescription<T> {
  notIn: { field: T; values: T[] };
}

export const isNotInDescription = (val: any): val is NotInDescription<any> =>
  isExactKind<NotInDescription<any>>(val, ['notIn']);
