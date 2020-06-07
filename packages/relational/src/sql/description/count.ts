import { FieldDescription } from './field';
import { ValueType } from './value-type';
import { isExactKind } from '@daita/common';

export interface CountDescription {
  count: { field: ValueType | FieldDescription, distinct?: boolean }
}

export const isCountDescription = (val: any): val is CountDescription => isExactKind<CountDescription>(val, ['count']);
