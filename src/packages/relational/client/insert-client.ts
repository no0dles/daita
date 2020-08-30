import { InsertSql } from '../sql';
import { RelationalInsertResult } from './relational-insert-result';

export interface InsertClient {
  insert<T>(sql: InsertSql<T>): Promise<RelationalInsertResult>;
}
