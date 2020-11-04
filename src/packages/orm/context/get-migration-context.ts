import { OrmMigrationContext } from './orm-migration-context';
import { isMigrationTree, MigrationTree } from '../migration/migration-tree';
import { OrmRelationalSchema } from '../schema/orm-relational-schema';
import { MigrationAdapterImplementation } from '../migration/migration-adapter-implementation';
import { InsertSql } from '../../relational/sql/insert-sql';

export interface MigrationContextUpdateOptions {
  targetMigration?: string;
}

export interface MigrationContext {
  needsUpdate(options?: MigrationContextUpdateOptions): Promise<boolean>;
  update(options?: MigrationContextUpdateOptions): Promise<void>;
}

export function getMigrationContext<TQuery extends InsertSql<any>, TOptions>(
  schema: OrmRelationalSchema,
  adapterImplementation: MigrationAdapterImplementation<TQuery, TOptions>,
  options?: TOptions,
): MigrationContext;
export function getMigrationContext<TQuery extends InsertSql<any>, TOptions>(
  migrations: MigrationTree,
  adapterImplementation: MigrationAdapterImplementation<TQuery, TOptions>,
  options?: TOptions,
): MigrationContext;
export function getMigrationContext<TQuery extends InsertSql<any>, TOptions>(
  migrations: MigrationTree | OrmRelationalSchema,
  adapterImplementation: MigrationAdapterImplementation<TQuery, TOptions>,
  options?: TOptions,
): MigrationContext {
  const client = adapterImplementation.getMigrationAdapter(options);
  if (isMigrationTree(migrations)) {
    return new OrmMigrationContext(client, migrations);
  } else {
    return new OrmMigrationContext(client, migrations.getMigrations());
  }
}
