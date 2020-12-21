import { TransactionContext } from './transaction-context';
import { Context } from './context';
import { RelationalMigrationAdapter } from '../adapter/relational-migration-adapter';
import { MigrationTree } from '../migration/migration-tree';
import { RuleContext } from '../../relational/permission/description/rule-context';
import { OrmRelationalSchema } from '../schema/orm-relational-schema';

export interface MigrationContextUpdateOptions {
  targetMigration?: string;
}

export interface MigrationContext<T> extends TransactionContext<T> {
  needsMigration(options?: MigrationContextUpdateOptions): Promise<boolean>;
  migrate(options?: MigrationContextUpdateOptions): Promise<void>;
  forSchema(migrationTree: MigrationTree | OrmRelationalSchema, auth?: RuleContext): MigrationContext<T>;
  migrationAdapter: RelationalMigrationAdapter<T>;
}

export const isMigrationContext = (
  val: Context<any> | TransactionContext<any> | MigrationContext<any>,
): val is MigrationContext<any> =>
  typeof (<any>val).migrate === 'function' && typeof (<any>val).needsMigration === 'function';
