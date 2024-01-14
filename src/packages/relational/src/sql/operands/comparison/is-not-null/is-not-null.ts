import { ValueType } from '../../value-type';
import { IsNotNullDescription } from './is-not-null-description';

export function isNotNull<T extends ValueType>(field: T): IsNotNullDescription<T> {
  return {
    isNotNull: { field },
  };
}
