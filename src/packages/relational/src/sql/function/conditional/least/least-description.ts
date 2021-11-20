import { FieldDescription, isFieldDescription } from '../../../keyword/field/field-description';
import { isExactKind } from '@daita/common/utils/is-exact-kind';

export interface LeastDescription {
  least: { left: FieldDescription | number | null; right: FieldDescription | number | null };
}

export const isLeastDescription = (val: any): val is LeastDescription =>
  isExactKind<LeastDescription>(val, ['least']) &&
  (isFieldDescription(val.least.left) ||
    typeof val.least.left === 'number' ||
    val.least.left === null ||
    val.least.left === undefined) &&
  (isFieldDescription(val.least.right) ||
    typeof val.least.right === 'number' ||
    val.least.right === null ||
    val.least.right === undefined);
