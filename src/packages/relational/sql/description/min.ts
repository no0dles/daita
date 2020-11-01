import { FieldDescription, isFieldDescription } from './field';
import { isExactKind } from '../../../common/utils/is-exact-kind';

export interface MinDescription {
  min: FieldDescription;
}

export const isMinDescription = (val: any): val is MinDescription =>
  isExactKind<MinDescription>(val, ['min']) && isFieldDescription(val.min);
