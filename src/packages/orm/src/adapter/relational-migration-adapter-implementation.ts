import { RelationalMigrationAdapter } from './relational-migration-adapter';

export interface RelationalMigrationAdapterImplementation<TQuery, TOptions> {
  getRelationalAdapter(options: TOptions): RelationalMigrationAdapter<TQuery>;
}
