import { ValueType } from '../../value-type';
import { NotInDescription } from './not-in-description';

export function isNotIn<T extends ValueType>(field: T, values: T[]): NotInDescription<T> {
  return { notIn: { field, values } };
}
