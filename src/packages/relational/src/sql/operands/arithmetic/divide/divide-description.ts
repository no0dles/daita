import { isExactKind } from '@daita/common/utils/is-exact-kind';
import { FieldDescription, isFieldDescription } from '../../../keyword/field/field-description';

export interface DivideDescription {
  divide: { left: FieldDescription | number; right: FieldDescription | number };
}

export const isDivideDescription = (val: any): val is DivideDescription =>
  isExactKind<DivideDescription>(val, ['divide']) &&
  (isFieldDescription(val.divide.left) || typeof val.divide.left === 'number') &&
  (isFieldDescription(val.divide.right) || typeof val.divide.right === 'number');
