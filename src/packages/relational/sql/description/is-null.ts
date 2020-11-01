import { isExactKind } from '../../../common/utils/is-exact-kind';

export interface IsNullDescription<T> {
  isNull: { field: T };
}

export const isNullDescription = (val: any): val is IsNullDescription<any> =>
  isExactKind<IsNullDescription<any>>(val, ['isNull']);
