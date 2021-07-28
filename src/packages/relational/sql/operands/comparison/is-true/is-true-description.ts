import { isExactKind } from '../../../../../common/utils/is-exact-kind';

export interface IsTrueDescription {
  isTrue: { field: boolean };
}

export const isTrueDescription = (val: any): val is IsTrueDescription =>
  isExactKind<IsTrueDescription>(val, ['isTrue']);
