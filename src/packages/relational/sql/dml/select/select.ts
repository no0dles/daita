import { SelectSql } from './select-sql';

export function select<T>(select: SelectSql<T>): SelectSql<T> {
  return select;
}
