import { RelationalMigrationClient, RelationalTransactionClient } from './relational-transaction-client';
import { TransactionClient } from './transaction-client';
import { RelationalAdapterImplementation } from '../adapter/relational-adapter-implementation';
import {
  isMigrationAdapter,
  MigrationAdapterImplementation,
} from '../../orm/migration/migration-adapter-implementation';
import { MigrationClient } from './migration-client';

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
  const dataAdapter = adapterImplementation.getRelationalAdapter(options);
  if (isMigrationAdapter(adapterImplementation)) {
    const migrationAdapter = adapterImplementation.getMigrationAdapter(dataAdapter, options);
    return new RelationalMigrationClient(dataAdapter, migrationAdapter);
  }
  return new RelationalTransactionClient(dataAdapter);
}
