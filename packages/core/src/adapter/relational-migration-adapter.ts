import {RelationalTransactionAdapter} from './relational-transaction-adapter';
import {SqlDmlQuery} from '../sql/sql-dml-builder';
import {SqlQuery} from '../sql/sql-query';
import {RelationalRawResult} from './relational-raw-result';

export interface RelationalMigrationAdapter extends RelationalTransactionAdapter {
  raw(sql: string, values: any[]): Promise<RelationalRawResult>;

  raw(sql: SqlQuery): Promise<RelationalRawResult>;

  raw(sql: SqlDmlQuery): Promise<RelationalRawResult>;
}