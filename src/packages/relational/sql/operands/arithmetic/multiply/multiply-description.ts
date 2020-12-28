import { isExactKind } from '../../../../../common/utils/is-exact-kind';
import { FieldDescription, isFieldDescription } from '../../../keyword/field/field-description';

export interface MultiplyDescription {
  multiply: { left: FieldDescription | number; right: FieldDescription | number };
}

export const isMultiplyDescription = (val: any): val is MultiplyDescription =>
  isExactKind<MultiplyDescription>(val, ['multiply']) &&
  (isFieldDescription(val.multiply.left) || typeof val.multiply.left === 'number') &&
  (isFieldDescription(val.multiply.right) || typeof val.multiply.right === 'number');
