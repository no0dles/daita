import { RelationalMigrationClient, RelationalTransactionClient } from './relational-transaction-client';
import { MigrationClient, TransactionClient } from './transaction-client';
import { RelationalAdapterImplementation } from '../adapter/relational-adapter-implementation';
import {
  isMigrationAdapter,
  MigrationAdapterImplementation,
} from '../../orm/migration/migration-adapter-implementation';

export function getClient<TQuery, TOptions>(
  adapterImplementation: RelationalAdapterImplementation<TQuery, TOptions> &
    MigrationAdapterImplementation<TQuery, TOptions>,
  options?: TOptions,
): MigrationClient<TQuery>;
export function getClient<TQuery, TOptions>(
  adapterImplementation: RelationalAdapterImplementation<TQuery, TOptions>,
  options?: TOptions,
): TransactionClient<TQuery>;
export function getClient<TQuery, TOptions>(
  adapterImplementation: RelationalAdapterImplementation<TQuery, TOptions>,
  options?: TOptions,
): TransactionClient<TQuery> | MigrationClient<TQuery> {
  const dataAdapter = adapterImplementation.getAdapter(options);
  if (isMigrationAdapter(adapterImplementation)) {
    const migrationAdapter = adapterImplementation.getMigrationAdapter(options);
    return new RelationalMigrationClient(dataAdapter, migrationAdapter);
  }
  return new RelationalTransactionClient(dataAdapter);
}
