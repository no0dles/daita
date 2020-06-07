import { SelectSql } from '../select-sql';

export function subSelect<T>(sql: SelectSql<T>): T {
  return sql as any;
}
