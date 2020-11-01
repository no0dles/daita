import { MigrationSql, OrmMigrationContext } from './orm-migration-context';
import { isMigrationTree, MigrationTree } from '../migration/migration-tree';
import { OrmRelationalSchema } from '../schema/orm-relational-schema';
import { TransactionClient } from '../../relational/client/transaction-client';
import { Client } from '../../relational/client/client';

export interface MigrationContext {
  needsUpdate(): Promise<boolean>;

  pendingUpdates(): Promise<MigrationSql[]>;

  update(trx?: Client<MigrationSql>): Promise<void>;
}

export function getMigrationContext(
  client: TransactionClient<MigrationSql>,
  schema: OrmRelationalSchema,
): MigrationContext;
export function getMigrationContext(
  client: TransactionClient<MigrationSql>,
  migrations: MigrationTree,
): MigrationContext;
export function getMigrationContext(
  client: TransactionClient<MigrationSql>,
  migrationsOrSchema: MigrationTree | OrmRelationalSchema,
): MigrationContext {
  if (isMigrationTree(migrationsOrSchema)) {
    return new OrmMigrationContext(client, migrationsOrSchema);
  } else {
    return new OrmMigrationContext(client, migrationsOrSchema.getMigrations());
  }
}
