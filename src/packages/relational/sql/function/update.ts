import { UpdateSql } from '../update-sql';

export function update<T>(sql: UpdateSql<T>): UpdateSql<T> {
  return sql;
}
