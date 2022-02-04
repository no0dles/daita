import { FieldDescription } from '../../../keyword/field/field-description';
import { isExactKind } from '@daita/common';
import { ValueType } from '../../../operands';

export interface CoalesceDescription {
  coalesce: { values: (FieldDescription | ValueType)[] };
}

export const isCoalesceDescription = (val: any): val is CoalesceDescription =>
  isExactKind<CoalesceDescription>(val, ['coalesce']) && val.coalesce.values instanceof Array;
