import { isExactKind } from '../../../../../common/utils/is-exact-kind';

export interface IsNotNullDescription<T> {
  isNotNull: { field: T };
}

export const isNotNullDescription = (val: any): val is IsNotNullDescription<any> =>
  isExactKind<IsNotNullDescription<any>>(val, ['isNotNull']);
