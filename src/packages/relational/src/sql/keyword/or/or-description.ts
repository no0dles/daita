import { ConditionDescription } from '../../operands/condition-description';
import { isExactKind } from '@daita/common';

export interface OrDescription {
  or: ConditionDescription[];
}

export const isOrDescription = (val: any): val is OrDescription => isExactKind<OrDescription>(val, ['or']);
