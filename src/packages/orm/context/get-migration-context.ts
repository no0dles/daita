import { TransactionContext } from './transaction-context';
import { Context } from './context';

export interface MigrationContextUpdateOptions {
  targetMigration?: string;
}

export interface MigrationContext<T> extends TransactionContext<T> {
  needsMigration(options?: MigrationContextUpdateOptions): Promise<boolean>;
  migrate(options?: MigrationContextUpdateOptions): Promise<void>;
}

export const isMigrationContext = (
  val: Context<any> | TransactionContext<any> | MigrationContext<any>,
): val is MigrationContext<any> =>
  typeof (<any>val).migrate === 'function' && typeof (<any>val).needsMigration === 'function';
