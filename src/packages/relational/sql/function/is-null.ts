import { ValueType } from '../description/value-type';
import { IsNullDescription } from '../description/is-null';

export function isNull<T extends ValueType>(field: T): IsNullDescription<T> {
  return {
    isNull: { field },
  };
}
