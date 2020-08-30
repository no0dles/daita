import { ValueType } from '../description/value-type';
import { NotInDescription } from '../description/not-in';

export function isNotIn<T extends ValueType>(
  field: T,
  values: T[],
): NotInDescription<T> {
  return { notIn: { field, values } };
}
