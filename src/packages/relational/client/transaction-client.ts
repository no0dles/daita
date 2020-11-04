import { Client } from './client';
import { RelationalDataAdapter } from '../adapter/relational-data-adapter';
import { MigrationAdapter } from '../../orm/migration/migration-adapter';

export interface TransactionClient<T> extends Client<T> {
  dataAdapter: RelationalDataAdapter<T>;
  transaction<R>(action: (trx: Client<T>) => Promise<R>): Promise<R>;
  close(): Promise<void>;
}

export interface MigrationClient<T> extends TransactionClient<T> {
  migrationAdapter: MigrationAdapter<T>;
}
