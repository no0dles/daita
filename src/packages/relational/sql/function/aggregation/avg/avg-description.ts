import { FieldDescription, isFieldDescription } from '../../../keyword/field/field-description';
import { isExactKind } from '../../../../../common/utils/is-exact-kind';

export interface AvgDescription {
  avg: FieldDescription;
}

export const isAvgDescription = (val: any): val is AvgDescription =>
  isExactKind<AvgDescription>(val, ['avg']) && isFieldDescription(val.avg);
