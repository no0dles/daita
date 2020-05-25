import { RelationalRawResult } from './relational-raw-result';

export interface RelationalDataAdapter {
  execRaw(sql: string, values: any[]): Promise<RelationalRawResult>;
  exec(sql: any): Promise<RelationalRawResult>;
  supportsQuery(sql: any): boolean;
  close(): Promise<void>;
}
