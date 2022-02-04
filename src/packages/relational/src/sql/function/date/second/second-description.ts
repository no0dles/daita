import { isExactKind } from '@daita/common';

export interface SecondDescription {
  second: { value: Date };
}

export const isSecondDescription = (val: any): val is SecondDescription =>
  isExactKind<SecondDescription>(val, ['second']) && !!val.second.value;
