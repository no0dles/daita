import { MigrationSql, OrmMigrationContext } from './orm-migration-context';
import { OrmRelationalSchema } from '../schema';
import { MigrationTree } from '../migration';
import { isMigrationTree } from '../migration/migration-tree';
import {
  Client,
  SelectClient,
  TransactionClient,
} from '../../relational/client';

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
