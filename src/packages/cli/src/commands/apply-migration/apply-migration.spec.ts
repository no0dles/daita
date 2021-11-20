import { setupEnv } from '@daita/testing';
import { addMigration } from '../add-migration/add-migration';
import { applyMigration } from './apply-migration';
import { getPostgresDb, PostgresDb } from '@daita/pg-adapter';

describe('cli/commands/migration:apply', () => {
  let postgresDb: PostgresDb;

  beforeAll(async () => {
    postgresDb = await getPostgresDb();
  });

  it(
    `should apply migration`,
    setupEnv(
      'apply-migration',
      async (ctx) => {
        await ctx.replaceContent('daita.json', /postgres:\/\/localhost\/postgres/g, postgresDb.connectionString);

        await addMigration('init', { cwd: ctx.cwd });
        await applyMigration({ cwd: ctx.cwd });
      },
      { schema: 'auth-schema' },
    ),
  );
});
