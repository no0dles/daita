import { isExactKind } from '@daita/common';

export interface HourDescription {
  hour: { value: Date };
}

export const isHourDescription = (val: any): val is HourDescription =>
  isExactKind<HourDescription>(val, ['hour']) && !!val.hour.value;
