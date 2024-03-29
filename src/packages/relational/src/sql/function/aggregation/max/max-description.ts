import { FieldDescription, isFieldDescription } from '../../../keyword/field/field-description';
import { isExactKind } from '@daita/common';

export interface MaxDescription {
  max: FieldDescription;
}

export const isMaxDescription = (val: any): val is MaxDescription =>
  isExactKind<MaxDescription>(val, ['max']) && isFieldDescription(val.max);
