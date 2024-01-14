import { isExactKind } from '@daita/common';

export interface DayOfMonthDescription {
  dayOfMonth: { value: Date };
}

export const isDayOfMonthDescription = (val: any): val is DayOfMonthDescription =>
  isExactKind<DayOfMonthDescription>(val, ['dayOfMonth']) && !!val.dayOfMonth.value;
