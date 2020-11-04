import { MigrationAdapter } from './migration-adapter';

export interface MigrationAdapterImplementation<TQuery, TOptions> {
  getMigrationAdapter(options?: TOptions): MigrationAdapter<TQuery>;
}

export const isMigrationAdapter = (val: any): val is MigrationAdapterImplementation<any, any> =>
  typeof val.getMigrationAdapter === 'function';
