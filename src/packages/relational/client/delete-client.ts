import { DeleteSql } from '../sql';
import { RelationalDeleteResult } from './relational-delete-result';

export interface DeleteClient {
  delete(sql: DeleteSql): Promise<RelationalDeleteResult>;
}
