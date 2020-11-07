import { setupEnv } from '../tests/utils.test';
import { HttpTransactionAdapter } from '../../http-adapter';
import { NodeHttp } from '../../http-client-common/node-http';
import { Defer } from '../../common/utils/defer';
import { getPostgresDb, PostgresDb } from '../../../testing/postgres-test';

describe('cli serve', () => {
  let postgresDb: PostgresDb;

  beforeAll(async () => {
    postgresDb = await getPostgresDb();
  });

  it(
    `should serve`,
    setupEnv(
      'serve',
      async (ctx) => {
        const defer = new Defer<void>();
        await ctx.replaceContent('daita.json', /postgres:\/\/localhost\/postgres/g, postgresDb.connectionString);

        const serve = ctx.run('serve --disable-auth');
        serve.onStdOut(async (text) => {
          if (text.indexOf('listening on http://localhost:8765') >= 0) {
            const client = new HttpTransactionAdapter(new NodeHttp('http://localhost:8765', null));
            const result = await client.exec({ select: { date: 'test' } });
            expect(result.rowCount).toEqual(1);
            expect(result.rows[0].date).not.toBeNull();
            expect(result.rows[0].date).not.toBeUndefined();
            serve.cancel();
          }
        });
        serve.onStdErr((text) => {
          if (!defer.isRejected) {
            defer.reject(text);
          }
        });
        await serve.finished;
      },
      { schema: 'auth-schema-migrated' },
    ),
  );

  afterAll(async () => {
    await postgresDb.close();
  });
});
