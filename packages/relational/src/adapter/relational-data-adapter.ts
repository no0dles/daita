import { SqlQuery } from '../sql/sql-query';
import { RelationalRawResult } from './relational-raw-result';

export interface RelationalDataAdapter {
  execRaw(sql: string, values: any[]): Promise<RelationalRawResult>;
  exec(sql: SqlQuery): Promise<RelationalRawResult>;
  close(): Promise<void>;
}
