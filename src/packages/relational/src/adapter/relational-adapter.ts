import { RelationalRawResult } from './relational-raw-result';
import { RuleContext } from '../permission';
import { DeleteSql, InsertSql, SelectSql, UpdateSql } from '../sql';
import { RelationalDeleteResult, RelationalInsertResult, RelationalUpdateResult } from '../client';

export interface RelationalAdapter<TQuery> {
  execRaw(sql: string, values: any[]): Promise<RelationalRawResult>;
  exec(sql: TQuery): Promise<RelationalRawResult>;
  supportsQuery<S>(sql: S): this is RelationalAdapter<TQuery | S>;
  delete(sql: DeleteSql): Promise<RelationalDeleteResult>;
  update<T>(sql: UpdateSql<T>): Promise<RelationalUpdateResult>;
  insert<T>(sql: InsertSql<T>): Promise<RelationalInsertResult>;
  select<T>(sql: SelectSql<T>): Promise<T[]>;
  selectFirst<T>(sql: SelectSql<T>): Promise<T>;
  close(): Promise<void>;
  transaction(action: (adapter: RelationalTransactionAdapter<TQuery>) => void): Promise<void>;
}

export interface RelationalTransactionAdapter<TQuery> {
  delete(sql: DeleteSql): void;
  insert<T>(sql: InsertSql<T>): void;
  update<T>(sql: UpdateSql<T>): void;
  execRaw(sql: string, values: any[]): void;
  supportsQuery<S>(sql: S): this is RelationalTransactionAdapter<TQuery | S>;
  exec(sql: TQuery): void;
}

export interface RelationalAuthorizableAdapter<TQuery> {
  authorize(context: RuleContext): RelationalAuthorizedAdapter<TQuery>;
}

export interface RelationalAuthorizedAdapter<TQuery> extends RelationalAdapter<TQuery> {
  isAuthorized(sql: any): Promise<boolean>;
}
