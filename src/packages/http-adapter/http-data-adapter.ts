import { Http } from '../http-client-common/http';
import { RelationalRawResult } from '../relational/adapter/relational-raw-result';
import { RelationalDataAdapter } from '../relational/adapter/relational-data-adapter';
import { handleErrorResponse } from './error-handling';
import { Resolvable } from '../common/utils/resolvable';

export class HttpDataAdapter implements RelationalDataAdapter {
  constructor(protected http: Resolvable<Http>) {}
  async execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    const http = await this.http.get();
    const result = await http.json<RelationalRawResult>({
      path: 'api/relational/execRaw',
      data: { sql, values },
      authorized: true,
    });
    handleErrorResponse(result);
    return result.data;
  }

  async exec(sql: any): Promise<RelationalRawResult> {
    const http = await this.http.get();
    const result = await http.json<RelationalRawResult>({
      path: 'api/relational/exec',
      data: { sql },
      authorized: true,
    });
    handleErrorResponse(result);
    return result.data;
  }

  supportsQuery(sql: any): boolean {
    return false;
  }

  async close(): Promise<void> {
    await this.http.close();
  }
}
