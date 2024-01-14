import { isExactKind } from '@daita/common';

export interface FloorDescription {
  floor: { value: number };
}

export const isFloorDescription = (val: any): val is FloorDescription =>
  isExactKind<FloorDescription>(val, ['floor']) && !!val.floor.value;
