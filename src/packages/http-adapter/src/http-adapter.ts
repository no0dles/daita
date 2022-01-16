import { Http } from '@daita/http-interface';
import {
  BaseRelationalAdapter,
  RelationalAdapter,
  RelationalRawResult,
  RelationalTransactionAdapter,
} from '@daita/relational';
import { handleErrorResponse } from './error-handling';
import { randomString, Resolvable } from '@daita/common';
import { HttpTransactionDataAdapter } from './http-transaction-data-adapter';
import { MigrationDescription, MigrationPlan, RelationalOrmAdapter } from '@daita/orm';

export class HttpAdapter extends BaseRelationalAdapter implements RelationalAdapter<any>, RelationalOrmAdapter {
  constructor(protected http: Http) {
    super();
  }

  async applyMigration(schema: string, migrationPlan: MigrationPlan): Promise<void> {
    const result = await this.http.json<{ message?: string }>({
      path: `api/orm/${schema}/migrations`,
      data: { migrationPlan },
      authorized: true,
    });
    if (result.statusCode >= 400) {
      throw new Error(result.data.message);
    }
  }

  async getAppliedMigrations(schema: string): Promise<MigrationDescription[]> {
    //TODO better response typing
    const result = await this.http.get<{ message?: string; migrations: MigrationDescription[] }>({
      path: `api/orm/${schema}/migrations`,
      authorized: true,
    });
    if (result.statusCode >= 400) {
      throw new Error(result.data.message);
    }
    return result.data.migrations;
  }

  async execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    const result = await this.http.json<RelationalRawResult>({
      path: 'api/relational/execRaw',
      data: { sql, values },
      authorized: true,
    });
    handleErrorResponse(result);
    return result.data;
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

  async transaction<T>(
    action: (adapter: RelationalTransactionAdapter<any>) => Promise<T>,
    timeout?: number,
  ): Promise<T> {
    const tid = randomString(12);
    const transaction = new HttpTransactionDataAdapter(tid, this.http);
    return transaction.run(() => action(transaction), timeout);
  }

  supportsQuery(sql: any): boolean {
    return false;
  }

  async close(): Promise<void> {}
}
