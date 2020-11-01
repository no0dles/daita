import { RelationalDataAdapter, RelationalRawResult } from '../relational/adapter';
import { Http } from '../http-client-common/http';

export class HttpDataAdapter implements RelationalDataAdapter {
  constructor(protected http: Http) {}
  async execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    const result = await this.http.json({ path: 'api/relational/execRaw', data: { sql, values }, authorized: true });
    return result.data;
  }
  async exec(sql: any): Promise<RelationalRawResult> {
    const result = await this.http.json({ path: 'api/relational/exec', data: { sql }, authorized: true });
    return result.data;
  }
  supportsQuery(sql: any): boolean {
    throw new Error('Method not implemented.');
  }

  async close(): Promise<void> {}
}
