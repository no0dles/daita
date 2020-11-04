import { MigrationAdapter } from '../../orm/migration/migration-adapter';
import { TransactionClient } from './transaction-client';

export interface MigrationClient<T> extends TransactionClient<T> {
  migrationAdapter: MigrationAdapter<T>;
}
