import { isExactKind } from '@daita/common';

export interface IsTrueDescription {
  isTrue: { field: boolean };
}

export const isTrueDescription = (val: any): val is IsTrueDescription =>
  isExactKind<IsTrueDescription>(val, ['isTrue']);
