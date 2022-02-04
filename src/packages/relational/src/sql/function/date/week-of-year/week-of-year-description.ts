import { isExactKind } from '@daita/common';

export interface WeekOfYearDescription {
  weekOfYear: { value: Date };
}

export const isWeekOfYearDescription = (val: any): val is WeekOfYearDescription =>
  isExactKind<WeekOfYearDescription>(val, ['weekOfYear']) && !!val.weekOfYear.value;
