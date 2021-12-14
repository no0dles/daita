import { isExactKind } from '@daita/common';

export interface YearDescription {
  year: { value: Date };
}

export const isYearDescription = (val: any): val is YearDescription =>
  isExactKind<YearDescription>(val, ['year']) && !!val.year.value;
