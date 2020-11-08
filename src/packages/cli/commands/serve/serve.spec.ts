import { setupEnv } from '../../../../testing/cli/utils.test';
import { HttpTransactionAdapter } from '../../../http-adapter';
import { NodeHttp } from '../../../http-client-common/node-http';
import { Defer } from '../../../common/utils/defer';
import { getPostgresDb, PostgresDb } from '../../../../testing/postgres-test';
import { serve } from './serve';

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
        task.ready.then(async () => {
          const client = new HttpTransactionAdapter(new NodeHttp('http://localhost:8765', null));
          const result = await client.exec({ select: { date: 'test' } });
          expect(result.rowCount).toEqual(1);
          expect(result.rows[0].date).not.toBeNull();
          expect(result.rows[0].date).not.toBeUndefined();
          task.cancel();
        });
        await task.result;
      },
      { schema: 'auth-schema-migrated' },
    ),
  );

  afterAll(async () => {
    await postgresDb.close();
  });
});
