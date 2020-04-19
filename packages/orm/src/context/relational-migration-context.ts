import {RelationalTransactionContext} from './relational-transaction-context';

export interface RelationalMigrationContext extends RelationalTransactionContext {
  applyMigrations(): Promise<void>;
}
