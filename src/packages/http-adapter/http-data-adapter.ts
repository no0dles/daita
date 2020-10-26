import { RelationalDataAdapter, RelationalRawResult } from '../relational/adapter';
import { Http } from '../http-client-common/http';

export class HttpDataAdapter implements RelationalDataAdapter {
  constructor(protected http: Http) {}
  async execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    const result = await this.http.sendJson('api/relational/execRaw', { sql, values });
    return result.data;
  }
  async exec(sql: any): Promise<RelationalRawResult> {
    const result = await this.http.sendJson('api/relational/exec', { sql });
    return result.data;
  }
  supportsQuery(sql: any): boolean {
    throw new Error('Method not implemented.');
  }

  async close(): Promise<void> {}
}
