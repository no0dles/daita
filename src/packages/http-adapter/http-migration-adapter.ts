import { HttpTransactionAdapter } from './http-transaction-adapter';
import { RelationalMigrationAdapter } from '../orm/adapter/relational-migration-adapter';
import { MigrationPlan } from '../orm/context/relational-migration-context';
import { MigrationDescription } from '../orm/migration/migration-description';

export class HttpMigrationAdapter extends HttpTransactionAdapter implements RelationalMigrationAdapter<any> {
  applyMigration(schema: string, migrationPlan: MigrationPlan[]): Promise<void> {
    return Promise.resolve(undefined);
  }

  getAppliedMigrations(schema: string): Promise<MigrationDescription[]> {
    return Promise.resolve([]);
  }
}
