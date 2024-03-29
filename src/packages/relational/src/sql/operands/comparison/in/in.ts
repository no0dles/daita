import { ValueType } from '../../value-type';
import { InDescription } from './in-description';
import { SelectSql } from '../../../dml';

export function isIn<T extends ValueType>(field: T, values: T[] | SelectSql<T>): InDescription<T> {
  return { in: { field, values } };
}
