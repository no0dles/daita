import { Condition } from './condition';
import { isExactKind } from '../../../common/utils/is-exact-kind';

export interface OrDescription {
  or: Condition[];
}

export const isOrDescription = (val: any): val is OrDescription => isExactKind<OrDescription>(val, ['or']);
