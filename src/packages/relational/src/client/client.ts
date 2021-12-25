import { RelationalRawResult } from '../adapter/relational-raw-result';
import { RelationalDataAdapter } from '../adapter/relational-data-adapter';
import { Rule, RuleContext } from '../permission';
import { SqlClient } from './sql-client';

export interface Client<T> extends SqlClient {
  dataAdapter: RelationalDataAdapter<T>;
  exec(sql: T): Promise<RelationalRawResult>;
  supportsQuery<S = any>(sql: S): this is Client<T | S>;
  authorizable(rules: { id: string; rule: Rule }[]): AuthorizableClient<T>;
}

export interface AuthorizableClient<T> {
  authorize(auth: RuleContext): AuthorizedClient<T>;
}

export interface AuthorizedClient<T> extends SqlClient {
  dataAdapter: RelationalDataAdapter<T>;
  exec(sql: T): Promise<RelationalRawResult>;
  supportsQuery<S = any>(sql: S): this is Client<T | S>;
  isAuthorized(sql: T): boolean;
}
