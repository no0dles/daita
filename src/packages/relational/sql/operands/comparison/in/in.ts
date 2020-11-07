import { ValueType } from '../../value-type';
import { InDescription } from './in-description';

export function isIn<T extends ValueType>(field: T, values: T[]): InDescription<T> {
  return { in: { field, values } };
}
