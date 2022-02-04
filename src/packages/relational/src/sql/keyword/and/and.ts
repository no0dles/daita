import { ConditionDescription } from '../../operands/condition-description';
import { AndDescription } from './and-description';

export function and(...conditions: ConditionDescription[]): AndDescription {
  return {
    and: conditions,
  };
}
