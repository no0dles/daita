import { InsertSql } from '../insert-sql';

export function insert<T>(sql: InsertSql<T>): InsertSql<any> {
  return sql;
}
