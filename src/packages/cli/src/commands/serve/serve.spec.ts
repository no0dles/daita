import { serve } from './serve';
import { getPostgresDb, PostgresDb } from '@daita/testing';
import { Resolvable } from '@daita/common';
import { field, table } from '@daita/relational';
import { equal } from '@daita/relational';
import { setupEnv } from '@daita/testing';
import { Http } from '@daita/http-interface';
import { NodeHttp } from '@daita/node';
import { schemaRoot } from '../../testing';
import { HttpAdapter } from '@daita/http-adapter';

describe('cli/commands/serve', () => {
  let postgresDb: PostgresDb;

  beforeAll(async () => {
    postgresDb = await getPostgresDb();
  });

  it(
    `should serve`,
    setupEnv(
      schemaRoot,
      'serve',
      async (ctx) => {
        await ctx.linkNodeModules();
        await ctx.replaceContent('daita.json', /postgres:\/\/localhost\/postgres/g, postgresDb.connectionString);

        const task = await serve({
          cwd: ctx.cwd,
        });

        try {
          const client = new HttpAdapter(
            new NodeHttp('http://localhost:8765', {
              async getToken(): Promise<string | null> {
                const authHttp = new NodeHttp('http://localhost:8766', null);
                const res = await authHttp.json({
                  authorized: false,
                  data: {
                    username: 'test',
                    password: '123456',
                  },
                  path: '/cli/login',
                });
                return `Bearer ${res.data.access_token}`;
              },
            }),
          );
          const result = await client.exec({
            update: table('User'),
            set: {
              password: '1234',
            },
            where: equal(field(table('User'), 'username'), 'cli|test'),
          });
          expect(result.rowCount).toEqual(0);
        } finally {
          await task.cancel();
        }
      },
      { schema: 'auth-schema-migrated' },
    ),
  );

  afterAll(async () => {
    await postgresDb.close();
  });
});
