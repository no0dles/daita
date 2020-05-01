import { SqlDmlQuery } from '../sql/sql-dml-builder';
import { SqlQuery } from '../sql/sql-query';
import { RelationalRawResult } from './relational-raw-result';
import { RelationalDataAdapter } from "./relational-data-adapter";

export interface RelationalMigrationAdapter
  extends RelationalDataAdapter {
  execRaw(sql: string, values: any[]): Promise<RelationalRawResult>;
  exec(sql: SqlQuery | SqlDmlQuery): Promise<RelationalRawResult>;
  transaction<T>(
    action: (adapter: RelationalMigrationTransactionAdapter) => Promise<T>,
  ): Promise<T>;
  close(): Promise<void>;
}

export interface RelationalMigrationTransactionAdapter
  extends RelationalDataAdapter {
  execRaw(sql: string, values: any[]): Promise<RelationalRawResult>;
  exec(sql: SqlQuery | SqlDmlQuery): Promise<RelationalRawResult>;
}
