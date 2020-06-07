import { FieldDescription } from './field';

export interface ConcatDescription {
  concat: (FieldDescription | string)[];
}
