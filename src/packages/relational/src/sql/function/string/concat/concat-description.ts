import { FieldDescription } from '../../../keyword/field/field-description';
import { isExactKind } from '@daita/common';

export interface ConcatDescription {
  concat: (FieldDescription | string)[];
}

export const isConcatDescription = (val: any): val is ConcatDescription => isExactKind(val, ['concat']);
