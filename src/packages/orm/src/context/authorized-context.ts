import { Context } from './context';
import { RelationalRawResult, SqlClient } from '@daita/relational';

export interface AuthorizedContext<T> extends SqlClient {
  isAuthorized(sql: T): Promise<boolean>;
  exec(sql: T): Promise<RelationalRawResult>;
  supportsQuery<S = any>(sql: S): this is Context<T | S>;
  close(): Promise<void>;
}
