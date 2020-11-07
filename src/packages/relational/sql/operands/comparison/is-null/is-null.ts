import { ValueType } from '../../value-type';
import { IsNullDescription } from './is-null-description';

export function isNull<T extends ValueType>(field: T): IsNullDescription<T> {
  return {
    isNull: { field },
  };
}
