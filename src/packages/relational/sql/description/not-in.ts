import { isExactKind } from '../../../common/utils';

export interface NotInDescription<T> {
  notIn: { field: T; values: T[] };
}

export const isNotInDescription = (val: any): val is NotInDescription<any> =>
  isExactKind<NotInDescription<any>>(val, ['notIn']);
