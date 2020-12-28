import { FieldDescription, isFieldDescription } from '../../../keyword/field/field-description';
import { isExactKind } from '../../../../../common/utils/is-exact-kind';

export interface AddDescription {
  add: { left: FieldDescription | number; right: FieldDescription | number };
}

export const isAddDescription = (val: any): val is AddDescription =>
  isExactKind<AddDescription>(val, ['add']) &&
  (isFieldDescription(val.add.left) || typeof val.add.left === 'number') &&
  (isFieldDescription(val.add.right) || typeof val.add.right === 'number');
