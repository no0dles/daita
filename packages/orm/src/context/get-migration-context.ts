import {
  Client,
  SelectClient,
  TransactionClient,
} from '@daita/relational';
import { MigrationSql, OrmMigrationContext } from './orm-migration-context';
import { RelationalSchema } from '../schema';
import { MigrationTree } from '../migration';
import { isMigrationTree } from '../migration/migration-tree';

export interface MigrationContext {
  needsUpdate(): Promise<boolean>;

  pendingUpdates(): Promise<MigrationSql[]>;

  update(trx?: Client<MigrationSql> & SelectClient): Promise<void>;
}

export function getMigrationContext(client: TransactionClient<SelectClient & Client<MigrationSql>> & SelectClient, schema: RelationalSchema): MigrationContext
export function getMigrationContext(client: TransactionClient<SelectClient & Client<MigrationSql>> & SelectClient, migrations: MigrationTree): MigrationContext
export function getMigrationContext(client: TransactionClient<SelectClient & Client<MigrationSql>> & SelectClient, migrationsOrSchema: MigrationTree | RelationalSchema): MigrationContext {
  if (isMigrationTree(migrationsOrSchema)) {
    return new OrmMigrationContext(client, migrationsOrSchema);
  } else {
    return new OrmMigrationContext(client, migrationsOrSchema.getMigrations());
  }
}
