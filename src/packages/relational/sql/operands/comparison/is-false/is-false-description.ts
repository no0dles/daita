import { isExactKind } from '../../../../../common/utils/is-exact-kind';

export interface IsFalseDescription {
  isFalse: { field: boolean };
}

export const isFalseDescription = (val: any): val is IsFalseDescription =>
  isExactKind<IsFalseDescription>(val, ['isFalse']);
