import { ConditionDescription } from '../../operands/condition-description';
import { isExactKind } from '@daita/common/utils/is-exact-kind';

export interface AndDescription {
  and: ConditionDescription[];
}

export const isAndDescription = (val: any): val is AndDescription => isExactKind<AndDescription>(val, ['and']);
