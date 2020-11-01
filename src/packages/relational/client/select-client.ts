import { SelectSql } from '../sql/select-sql';

export interface SelectClient {
  selectFirst<T>(sql: SelectSql<T>): Promise<T>;
  select<T>(sql: SelectSql<T>): Promise<T[]>;
}
