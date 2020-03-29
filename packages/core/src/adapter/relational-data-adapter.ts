import {SqlQuery} from '../sql/sql-query';
import {RelationalRawResult} from './relational-raw-result';

export interface RelationalDataAdapter {
  raw(sql: string, values: any[]): Promise<RelationalRawResult>;
  raw(sql: SqlQuery): Promise<RelationalRawResult>;
}
