import { isExactKind } from '@daita/common/utils/is-exact-kind';
import { FieldDescription, isFieldDescription } from '../../../keyword/field/field-description';

export interface SubtractDescription {
  subtract: { left: FieldDescription | number; right: FieldDescription | number };
}

export const isSubtractDescription = (val: any): val is SubtractDescription =>
  isExactKind<SubtractDescription>(val, ['subtract']) &&
  (isFieldDescription(val.subtract.left) || typeof val.subtract.left === 'number') &&
  (isFieldDescription(val.subtract.right) || typeof val.subtract.right === 'number');
