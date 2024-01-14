import { Http } from '@daita/http-interface';
import {
  BaseRelationalAdapter,
  RelationalAdapter,
  RelationalRawResult,
  RelationalTransactionAdapter,
} from '@daita/relational';
import { handleErrorResponse } from './error-handling';
import { randomString } from '@daita/common';
import { HttpTransactionDataAdapter } from './http-transaction-data-adapter';
import { RelationalOrmAdapter, SchemaTableFieldTypeDescription } from '@daita/orm';

export class HttpAdapter extends BaseRelationalAdapter implements RelationalAdapter<any>, RelationalOrmAdapter {
  constructor(protected http: Http) {
    super();
  }

  getDatabaseType(type: SchemaTableFieldTypeDescription, size?: string): string {
    return size ? `${type},${size}` : `${type}`;
  }

  async execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    throw new Error('not supported over http');
  }

  async exec(sql: any): Promise<RelationalRawResult> {
    const result = await this.http.json<RelationalRawResult>({
      path: 'api/relational/exec',
      data: { sql },
      authorized: true,
    });
    handleErrorResponse(result);
    return result.data;
  }

  async transaction(action: (adapter: RelationalTransactionAdapter<any>) => void): Promise<void> {
    const tid = randomString(12);
    const transaction = new HttpTransactionDataAdapter(tid, this.http);
    action(transaction);
    await transaction.send();
  }

  supportsQuery(sql: any): boolean {
    return false;
  }

  async close(): Promise<void> {}
}
