import { MigrationAdapter } from './migration-adapter';

export interface MigrationAdapterImplementation<TQuery, TOptions> {
  getMigrationAdapter(options?: TOptions): MigrationAdapter<TQuery>;
}
