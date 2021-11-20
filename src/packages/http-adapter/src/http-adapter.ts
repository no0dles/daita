import { HttpTransactionAdapter } from './http-transaction-adapter';
import { RelationalMigrationAdapter } from '@daita/orm';
import { MigrationPlan } from '@daita/orm';
import { MigrationDescription } from '@daita/orm';

export class HttpAdapter extends HttpTransactionAdapter implements RelationalMigrationAdapter<any> {
  async applyMigration(schema: string, migrationPlan: MigrationPlan): Promise<void> {
    const http = await this.http.get();
    const result = await http.json<{ message?: string }>({
      path: `api/orm/${schema}/migrations`,
      method: 'POST',
      data: { migrationPlan },
      authorized: true,
    });
    if (result.statusCode >= 400) {
      throw new Error(result.data.message);
    }
  }

  async getAppliedMigrations(schema: string): Promise<MigrationDescription[]> {
    const http = await this.http.get();
    //TODO better response typing
    const result = await http.json<{ message?: string; migrations: MigrationDescription[] }>({
      method: 'GET',
      path: `api/orm/${schema}/migrations`,
      authorized: true,
    });
    if (result.statusCode >= 400) {
      throw new Error(result.data.message);
    }
    return result.data.migrations;
  }
}
