import { RelationalRawResult } from './relational-raw-result';
import { Sql } from '../sql';

export interface RelationalDataAdapter<TQuery = Sql<any>> {
  execRaw(sql: string, values: any[]): Promise<RelationalRawResult>;
  exec(sql: TQuery): Promise<RelationalRawResult>;
  supportsQuery(sql: any): boolean;
  close(): Promise<void>;
}
