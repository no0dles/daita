import { Condition } from '../description/condition';
import { OrDescription } from '../description/or';

export function or(...conditions: Condition[]): OrDescription {
  return {
    or: conditions,
  };
}
