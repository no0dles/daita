import { AuthorizedTransactionContext, TransactionContext } from './transaction-context';
import { Context } from './context';
import { RelationalMigrationAdapter } from '../adapter/relational-migration-adapter';
import { MigrationTree } from '../migration/migration-tree';
import { OrmRelationalSchema } from '../schema/orm-relational-schema';
import { RuleContext } from '@daita/relational';

export interface MigrationContextUpdateOptions {
  targetMigration?: string;
}

export interface MigrationContext<T> extends TransactionContext<T> {
  needsMigration(options?: MigrationContextUpdateOptions): Promise<boolean>;
  migrate(options?: MigrationContextUpdateOptions): Promise<void>;
  forSchema(migrationTree: MigrationTree | OrmRelationalSchema): MigrationContext<T>;
  migrationAdapter: RelationalMigrationAdapter<T>;
  remove(): Promise<void>;
  authorize(auth: RuleContext): AuthorizedMigrationContext<T>;
}

export interface AuthorizedMigrationContext<T> extends AuthorizedTransactionContext<T> {
  needsMigration(options?: MigrationContextUpdateOptions): Promise<boolean>;
  migrate(options?: MigrationContextUpdateOptions): Promise<void>;
  forSchema(migrationTree: MigrationTree | OrmRelationalSchema): AuthorizedMigrationContext<T>;
  migrationAdapter: RelationalMigrationAdapter<T>;
  remove(): Promise<void>;
}

export const isMigrationContext = (
  val: Context<any> | TransactionContext<any> | MigrationContext<any>,
): val is MigrationContext<any> =>
  typeof (<any>val).migrate === 'function' && typeof (<any>val).needsMigration === 'function';
