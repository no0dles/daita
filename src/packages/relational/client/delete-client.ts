import { RelationalDeleteResult } from './relational-delete-result';
import { DeleteSql } from '../sql/delete-sql';

export interface DeleteClient {
  delete(sql: DeleteSql): Promise<RelationalDeleteResult>;
}
