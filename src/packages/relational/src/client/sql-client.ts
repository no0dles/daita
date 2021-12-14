import { RelationalRawResult } from '../adapter';
import { DeleteSql, InsertSql, SelectSql, UpdateSql } from '../sql';
import { RelationalUpdateResult } from './relational-update-result';
import { RelationalInsertResult } from './relational-insert-result';
import { RelationalDeleteResult } from './relational-delete-result';

export interface SqlClient {
  supportsQuery(sql: any): boolean;
  exec(sql: any): Promise<RelationalRawResult>;
  update<T>(sql: UpdateSql<T>): Promise<RelationalUpdateResult>;
  selectFirst<T>(sql: SelectSql<T>): Promise<T | null>;
  select<T>(sql: SelectSql<T>): Promise<T[]>;
  insert<T>(sql: InsertSql<T>): Promise<RelationalInsertResult>;
  delete(sql: DeleteSql): Promise<RelationalDeleteResult>;
}

export interface SqlTransactionClient extends SqlClient {
  transaction<R>(action: (trx: SqlClient) => Promise<R>): Promise<R>;
}
