import { RelationalInsertResult } from './relational-insert-result';
import { InsertSql } from '../sql/dml/insert/insert-sql';

export interface InsertClient {
  insert<T>(sql: InsertSql<T>): Promise<RelationalInsertResult>;
}
