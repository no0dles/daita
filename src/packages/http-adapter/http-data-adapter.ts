import {HttpBase} from './http-base';
import {RelationalDataAdapter, RelationalRawResult} from '../relational/adapter';

export class HttpDataAdapter extends HttpBase implements RelationalDataAdapter {
  async execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    const result = await this.send('execRaw', {sql, values});
    return result.data;
  }
  async exec(sql: any): Promise<RelationalRawResult> {
    const result = await this.send('exec', {sql});
    return result.data;
  }
  supportsQuery(sql: any): boolean {
    throw new Error("Method not implemented.");
  }
  
  async close(): Promise<void> {
    
  }
}
