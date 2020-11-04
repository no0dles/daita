import { MigrationAdapter } from './migration-adapter';
import { RelationalTransactionAdapter } from '../../relational/adapter/relational-transaction-adapter';

export interface MigrationAdapterImplementation<TQuery, TOptions> {
  getMigrationAdapter(dataAdapter: RelationalTransactionAdapter<TQuery>, options?: TOptions): MigrationAdapter<TQuery>;
}

export const isMigrationAdapter = (val: any): val is MigrationAdapterImplementation<any, any> =>
  typeof val.getMigrationAdapter === 'function';
