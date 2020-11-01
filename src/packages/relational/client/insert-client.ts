import { RelationalInsertResult } from './relational-insert-result';
import { InsertSql } from '../sql/insert-sql';

export interface InsertClient {
  insert<T>(sql: InsertSql<T>): Promise<RelationalInsertResult>;
}
