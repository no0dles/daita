import { isExactKind } from '@daita/common';

export interface DayOfWeekDescription {
  dayOfWeek: { value: Date };
}

export const isDayOfWeekDescription = (val: any): val is DayOfWeekDescription =>
  isExactKind<DayOfWeekDescription>(val, ['dayOfWeek']) && !!val.dayOfWeek.value;
