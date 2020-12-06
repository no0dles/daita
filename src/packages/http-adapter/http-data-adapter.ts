import { Http, HttpSendResult } from '../http-client-common/http';
import { RelationalRawResult } from '../relational/adapter/relational-raw-result';
import { RelationalDataAdapter } from '../relational/adapter/relational-data-adapter';
import { handleErrorResponse } from './error-handling';

export class HttpDataAdapter implements RelationalDataAdapter {
  constructor(protected http: Http, protected init: Promise<void>, private closeFn: () => void) {}
  async execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    await this.init;
    const result = await this.http.json({ path: 'api/relational/execRaw', data: { sql, values }, authorized: true });
    handleErrorResponse(result);
    return result.data;
  }

  async exec(sql: any): Promise<RelationalRawResult> {
    await this.init;
    const result = await this.http.json({ path: 'api/relational/exec', data: { sql }, authorized: true });
    handleErrorResponse(result);
    return result.data;
  }

  supportsQuery(sql: any): boolean {
    return false;
  }

  close(): Promise<void> {
    this.closeFn();
    return Promise.resolve();
  }
}
