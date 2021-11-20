import { setupEnv } from '@daita/testing/cli/utils.test';
import { NodeHttp } from '../../../http-client-common/node-http';
import { serve } from './serve';
import { getPostgresDb, PostgresDb } from '@daita/pg-adapter/testing/postgres-test-adapter';
import { HttpTransactionAdapter } from '@daita/http-adapter/http-transaction-adapter';
import { Resolvable } from '@daita/common/utils/resolvable';
import { Http } from '../../../http-client-common/http';
import { field, table } from '@daita/relational';
import { equal } from '@daita/relational/sql/operands/comparison/equal/equal';
import { User } from '@daita/testing/cli/schemas/auth-schema-migrated/src/models/user';

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
        });

        try {
          const client = new HttpTransactionAdapter(
            new Resolvable<Http>(
              new NodeHttp('http://localhost:8765', {
                async getToken(): Promise<string | null> {
                  const authHttp = new NodeHttp('http://localhost:8766', null);
                  const res = await authHttp.json({
                    authorized: false,
                    method: 'POST',
                    data: {
                      username: 'test',
                      password: '123456',
                    },
                    path: '/cli/login',
                  });
                  return `Bearer ${res.data.access_token}`;
                },
              }),
            ),
          );
          const result = await client.exec({
            update: table(User),
            set: {
              password: '1234',
            },
            where: equal(field(User, 'username'), 'cli|test'),
          });
          expect(result.rowCount).toEqual(0);
        } finally {
          task.cancel();
        }
      },
      { schema: 'auth-schema-migrated' },
    ),
  );

  afterAll(async () => {
    await postgresDb.close();
  });
});
