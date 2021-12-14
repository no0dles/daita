import { RelationalRawResult, RuleContext, SqlClient } from '@daita/relational';
import { AuthorizedContext } from './authorized-context';

export interface Context<T> extends SqlClient {
  authorize(auth: RuleContext): AuthorizedContext<T>;
  exec(sql: T): Promise<RelationalRawResult>;
  supportsQuery<S = any>(sql: S): this is Context<T | S>;
  close(): Promise<void>;
}
