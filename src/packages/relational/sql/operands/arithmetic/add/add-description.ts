import { FieldDescription, isFieldDescription } from '../../../keyword/field/field-description';
import { isExactKind } from '../../../../../common/utils/is-exact-kind';

export interface AddDescription {
  add: { left: FieldDescription | number | null; right: FieldDescription | number | null };
}

export const isAddDescription = (val: any): val is AddDescription =>
  isExactKind<AddDescription>(val, ['add']) &&
  (isFieldDescription(val.add.left) ||
    typeof val.add.left === 'number' ||
    val.add.left === null ||
    val.add.left === undefined) &&
  (isFieldDescription(val.add.right) ||
    typeof val.add.right === 'number' ||
    val.add.right === null ||
    val.add.right === undefined);
