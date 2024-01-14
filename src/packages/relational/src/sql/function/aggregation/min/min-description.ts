import { FieldDescription, isFieldDescription } from '../../../keyword/field/field-description';
import { isExactKind } from '@daita/common';

export interface MinDescription {
  min: FieldDescription;
}

export const isMinDescription = (val: any): val is MinDescription =>
  isExactKind<MinDescription>(val, ['min']) && isFieldDescription(val.min);
