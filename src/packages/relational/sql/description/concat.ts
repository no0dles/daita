import { FieldDescription } from './field';
import { isExactKind } from '../../../common/utils';

export interface ConcatDescription {
  concat: (FieldDescription | string)[];
}

export const isConcatDescription = (val: any): val is ConcatDescription =>
  isExactKind(val, ['concat']);
