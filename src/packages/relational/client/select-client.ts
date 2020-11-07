import { SelectSql } from '../sql/dml/select/select-sql';

export interface SelectClient {
  selectFirst<T>(sql: SelectSql<T>): Promise<T>;
  select<T>(sql: SelectSql<T>): Promise<T[]>;
}
