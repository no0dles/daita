import { Condition } from './condition';
import { isExactKind } from '@daita/common';

export interface OrDescription {
  or: Condition[];
}

export const isOrDescription = (val: any): val is OrDescription => isExactKind<OrDescription>(val, ['or']);

