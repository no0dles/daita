import { ConditionDescription } from '../../operands/condition-description';
import { AndDescription } from './and-description';

export type NonEmptyArray<T> = T[] & { 0: T };

export function and(...conditions: NonEmptyArray<ConditionDescription>): AndDescription {
  return {
    and: conditions,
  };
}
