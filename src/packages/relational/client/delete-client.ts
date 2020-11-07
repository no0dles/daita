import { RelationalDeleteResult } from './relational-delete-result';
import { DeleteSql } from '../sql/dml/delete/delete-sql';

export interface DeleteClient {
  delete(sql: DeleteSql): Promise<RelationalDeleteResult>;
}
