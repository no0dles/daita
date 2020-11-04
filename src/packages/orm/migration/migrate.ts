import { RelationalSchema } from '../schema/relational-schema';
import { OrmMigrationContext } from '../context/orm-migration-context';
import { MigrationClient } from '../../relational/client/migration-client';

export async function migrate(client: MigrationClient<any>, schema: RelationalSchema) {
  const ctx = new OrmMigrationContext(client.migrationAdapter, schema.getMigrations());
  await ctx.update();
}
