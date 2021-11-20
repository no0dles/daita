import { ConditionDescription } from '../../operands/condition-description';
import { OrDescription } from './or-description';

export function or(...conditions: ConditionDescription[]): OrDescription {
  return {
    or: conditions,
  };
}
