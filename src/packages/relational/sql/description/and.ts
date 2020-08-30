import { Condition } from './condition';
import {isExactKind} from '../../../common/utils';

export interface AndDescription {
  and: Condition[];
}

export const isAndDescription = (val: any): val is AndDescription => isExactKind<AndDescription>(val, ['and']);

