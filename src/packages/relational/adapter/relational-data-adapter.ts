import { RelationalRawResult } from './relational-raw-result';
import { Sql } from '../sql';

export interface RelationalDataAdapter<TQuery = Sql<any>> {
  execRaw(sql: string, values: any[]): Promise<RelationalRawResult>;
  exec(sql: TQuery): Promise<RelationalRawResult>;
  supportsQuery<S>(sql: S): this is RelationalDataAdapter<TQuery | S>;
  close(): Promise<void>;
}
