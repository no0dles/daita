import { Condition } from '../description/condition';
import { AndDescription } from '../description/and';

export function and(...conditions: Condition[]): AndDescription {
  return {
    and: conditions,
  };
}
