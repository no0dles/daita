import {RelationalDataAdapter, RelationalRawResult, SqlQuery} from '@daita/relational';
import {HttpBase} from './http-base';

export class HttpDataAdapter extends HttpBase implements RelationalDataAdapter {
  raw(sql: string, values: any[]): Promise<RelationalRawResult>;
  raw(sql: SqlQuery): Promise<RelationalRawResult>;
  async raw(sql: string | SqlQuery, values?: any[]): Promise<RelationalRawResult> {
    const result = await this.send('exec', {sql: sql});
    return result.data;
  }
}
