import { FieldDescription, isFieldDescription } from './field';
import {isExactKind} from '../../../common/utils';

export interface MaxDescription {
  max: FieldDescription;
}

export const isMaxDescription = (val: any): val is MaxDescription => isExactKind<MaxDescription>(val, ['max']) && isFieldDescription(val.max);
