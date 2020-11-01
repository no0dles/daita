import { RelationalUpdateResult } from './relational-update-result';
import { UpdateSql } from '../sql/update-sql';

export interface UpdateClient {
  update(sql: UpdateSql<any>): Promise<RelationalUpdateResult>;
}
