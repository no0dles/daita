import { ConditionDescription } from '../../operands/condition-description';
import { isExactKind } from '@daita/common';

export interface AndDescription {
  and: ConditionDescription[];
}

export const isAndDescription = (val: any): val is AndDescription => isExactKind<AndDescription>(val, ['and']);
