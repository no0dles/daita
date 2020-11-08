import { FieldDescription, isFieldDescription } from '../../../keyword/field/field-description';
import { isExactKind } from '../../../../../common/utils/is-exact-kind';

export interface SumDescription {
  sum: FieldDescription;
}

export const isSumDescription = (val: any): val is SumDescription =>
  isExactKind<SumDescription>(val, ['sum']) && isFieldDescription(val.sum);
