import { isExactKind } from '@daita/common';

export interface DayOfYearDescription {
  dayOfYear: { value: Date };
}

export const isDayOfYearDescription = (val: any): val is DayOfYearDescription =>
  isExactKind<DayOfYearDescription>(val, ['dayOfYear']) && !!val.dayOfYear.value;
