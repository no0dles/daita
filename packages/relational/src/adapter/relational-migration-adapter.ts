import { SqlDmlQuery } from '../sql/sql-dml-builder';
import { SqlQuery } from '../sql/sql-query';
import { RelationalRawResult } from './relational-raw-result';
import { RelationalDataAdapter } from "./relational-data-adapter";

export interface RelationalMigrationAdapter
  extends RelationalDataAdapter {
  raw(sql: string, values: any[]): Promise<RelationalRawResult>;
  raw(sql: SqlQuery | SqlDmlQuery): Promise<RelationalRawResult>;
  transaction<T>(
    action: (adapter: RelationalMigrationTransactionAdapter) => Promise<T>,
  ): Promise<T>;
}

export interface RelationalMigrationTransactionAdapter
  extends RelationalDataAdapter {
  raw(sql: string, values: any[]): Promise<RelationalRawResult>;
  raw(sql: SqlQuery | SqlDmlQuery): Promise<RelationalRawResult>;
}
