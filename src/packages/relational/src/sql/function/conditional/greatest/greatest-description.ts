import { FieldDescription, isFieldDescription } from '../../../keyword/field/field-description';
import { isExactKind } from '@daita/common';

export interface GreatestDescription {
  greatest: { left: FieldDescription | number; right: FieldDescription | number };
}

export const isGreatestDescription = (val: any): val is GreatestDescription =>
  isExactKind<GreatestDescription>(val, ['greatest']) &&
  (isFieldDescription(val.greatest.left) ||
    typeof val.greatest.left === 'number' ||
    val.greatest.left === null ||
    val.greatest.left === undefined) &&
  (isFieldDescription(val.greatest.right) ||
    typeof val.greatest.right === 'number' ||
    val.greatest.right === null ||
    val.greatest.right === undefined);
