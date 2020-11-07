import { OrmMigrationContext } from './orm-migration-context';
import { isMigrationTree, MigrationTree } from '../migration/migration-tree';
import { OrmRelationalSchema } from '../schema/orm-relational-schema';
import { InsertSql } from '../../relational/sql/dml/insert/insert-sql';
import { MigrationClient } from '../../relational/client/migration-client';

export interface MigrationContextUpdateOptions {
  targetMigration?: string;
}

export interface MigrationContext {
  needsUpdate(options?: MigrationContextUpdateOptions): Promise<boolean>;
  update(options?: MigrationContextUpdateOptions): Promise<void>;
}

export function getMigrationContext<TQuery extends InsertSql<any>, TOptions>(
  schema: OrmRelationalSchema,
  migrationClient: MigrationClient<TQuery>,
): MigrationContext;
export function getMigrationContext<TQuery extends InsertSql<any>, TOptions>(
  migrations: MigrationTree,
  migrationClient: MigrationClient<TQuery>,
): MigrationContext;
export function getMigrationContext<TQuery extends InsertSql<any>, TOptions>(
  migrations: MigrationTree | OrmRelationalSchema,
  migrationClient: MigrationClient<TQuery>,
): MigrationContext {
  if (isMigrationTree(migrations)) {
    return new OrmMigrationContext(migrationClient.migrationAdapter, migrations);
  } else {
    return new OrmMigrationContext(migrationClient.migrationAdapter, migrations.getMigrations());
  }
}
