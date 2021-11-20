import { RelationalUpdateResult } from './relational-update-result';
import { UpdateSql } from '../sql/dml/update/update-sql';

export interface UpdateClient {
  update<T>(sql: UpdateSql<T>): Promise<RelationalUpdateResult>;
}
