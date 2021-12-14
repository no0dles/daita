import { isExactKind } from '@daita/common';

export interface MonthDescription {
  month: { value: Date };
}

export const isMonthDescription = (val: any): val is MonthDescription =>
  isExactKind<MonthDescription>(val, ['month']) && !!val.month.value;
