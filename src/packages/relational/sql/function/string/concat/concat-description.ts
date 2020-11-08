import { FieldDescription } from '../../../keyword/field/field-description';
import { isExactKind } from '../../../../../common/utils/is-exact-kind';

export interface ConcatDescription {
  concat: (FieldDescription | string)[];
}

export const isConcatDescription = (val: any): val is ConcatDescription => isExactKind(val, ['concat']);
