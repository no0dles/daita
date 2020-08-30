import { UpdateSql } from '../sql';
import { RelationalUpdateResult } from './relational-update-result';

export interface UpdateClient {
  update(sql: UpdateSql<any>): Promise<RelationalUpdateResult>;
}
