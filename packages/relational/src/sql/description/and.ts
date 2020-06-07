import { Condition } from './condition';
import { isExactKind } from '@daita/common';

export interface AndDescription {
  and: Condition[];
}

export const isAndDescription = (val: any): val is AndDescription => isExactKind<AndDescription>(val, ['and']);

