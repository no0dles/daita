import { ValueType } from '../../value-type';
import { NotInDescription } from './not-in-description';
import { SelectSql } from '../../../dml';

export function isNotIn<T extends ValueType>(field: T, values: T[] | SelectSql<T>): NotInDescription<T> {
  return { notIn: { field, values } };
}
