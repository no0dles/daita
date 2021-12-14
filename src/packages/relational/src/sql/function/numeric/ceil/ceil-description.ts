import { isExactKind } from '@daita/common';

export interface CeilDescription {
  ceil: { value: number };
}

export const isCeilDescription = (val: any): val is CeilDescription =>
  isExactKind<CeilDescription>(val, ['ceil']) && !!val.ceil.value;
