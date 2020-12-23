import { HttpTransactionAdapter } from './http-transaction-adapter';
import { RelationalMigrationAdapter } from '../orm/adapter/relational-migration-adapter';
import { MigrationPlan } from '../orm/context/relational-migration-context';
import { MigrationDescription } from '../orm/migration/migration-description';

export class HttpMigrationAdapter extends HttpTransactionAdapter implements RelationalMigrationAdapter<any> {
  async applyMigration(schema: string, migrationPlan: MigrationPlan): Promise<void> {
    const http = await this.http.get();
    const result = await http.json({
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
    const result = await http.json({
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
