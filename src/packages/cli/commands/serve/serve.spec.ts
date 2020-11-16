import { setupEnv } from '../../../../testing/cli/utils.test';
import { NodeHttp } from '../../../http-client-common/node-http';
import { serve } from './serve';
import { getPostgresDb, PostgresDb } from '../../../pg-adapter/testing/postgres-test-adapter';
import { HttpTransactionAdapter } from '../../../http-adapter/http-transaction-adapter';

describe('cli/commands/serve', () => {
  let postgresDb: PostgresDb;

  beforeAll(async () => {
    postgresDb = await getPostgresDb();
  });

  it(
    `should serve`,
    setupEnv(
      'serve',
      async (ctx) => {
        await ctx.replaceContent('daita.json', /postgres:\/\/localhost\/postgres/g, postgresDb.connectionString);

        const task = await serve({
          cwd: ctx.cwd,
          disableAuth: true,
        });

        const client = new HttpTransactionAdapter(
          new NodeHttp('http://localhost:8765', null),
          Promise.resolve(),
          () => {},
        );
        const result = await client.exec({ select: { date: 'test' } });
        expect(result.rowCount).toEqual(1);
        expect(result.rows[0].date).not.toBeNull();
        expect(result.rows[0].date).not.toBeUndefined();
        task.cancel();
      },
      { schema: 'auth-schema-migrated' },
    ),
  );

  afterAll(async () => {
    await postgresDb.close();
  });
});
