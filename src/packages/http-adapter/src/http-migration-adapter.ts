import { RelationalMigrationAdapter } from '@daita/orm';
import { MigrationPlan } from '@daita/orm';
import { MigrationDescription } from '@daita/orm';
import { HttpTransactionAdapter } from './http-transaction-adapter';

export class HttpMigrationAdapter extends HttpTransactionAdapter implements RelationalMigrationAdapter<any> {
  async applyMigration(schema: string, migrationPlan: MigrationPlan): Promise<void> {
    const http = await this.http.get();
    const result = await http.json<{ message?: string }>({
      path: `api/orm/${schema}/migrations`,
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
    const result = await http.get<{ message?: string; migrations: MigrationDescription[] }>({
      path: `api/orm/${schema}/migrations`,
      authorized: true,
    });
    if (result.statusCode >= 400) {
      throw new Error(result.data.message);
    }
    return result.data.migrations;
  }

  async remove(): Promise<void> {
    // TODO
  }
}