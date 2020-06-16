import { Condition } from '../description/condition';
import { AndDescription } from '../description/and';

export type NonEmptyArray<T> = T[] & { 0: T};

export function and(...conditions: NonEmptyArray<Condition>): AndDescription {
  return {
    and: conditions,
  };
}
