import { ValueType } from '../description/value-type';
import { InDescription } from '../description/in';

export function isIn<T extends ValueType>(
  field: T,
  values: T[],
): InDescription<T> {
  return { in: { field, values } };
}
