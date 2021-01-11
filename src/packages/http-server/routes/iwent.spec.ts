import { getPostgresDb, PostgresDb } from '../../pg-adapter/testing/postgres-test-adapter';
import { getContext } from '../../orm';
import { adapter } from '../../pg-adapter';
import { authSchema } from '../../auth-server/schema';
import { MigrationTree } from '../../orm/migration/migration-tree';
import { allow, authorized } from '../../relational';
import { now } from '../../relational/sql/function/date/now/now';
import { getRuleId } from '../../relational/permission/rule-id';
import { getServer, httpPost, HttpServerApp } from '../../../testing/http-server';
import { createAuthApp } from '../../auth-server/app';
import { createAuthAdminApp } from '../../auth-server/admin-app';
import { createHttpServerApp } from '../app';
import { createDefaultUser, createDefaultUserPool } from '../../../testing/auth-test';
import { MigrationContext } from '../../orm/context/get-migration-context';

describe('http-server/routes/iwent', () => {
  let authCtx: MigrationContext<any>;
  let httpCtx: MigrationContext<any>;
  let postgresDb: PostgresDb;
  let authApp: HttpServerApp;
  let authAdminApp: HttpServerApp;
  let httpApp: HttpServerApp;

  afterAll(async () => {
    await authApp.close();
    await authAdminApp.close();
    await httpApp.close();
    await authCtx.close();
    await postgresDb.close();
  });

  beforeAll(async () => {
    postgresDb = await getPostgresDb();
    authCtx = getContext(adapter, {
      schema: authSchema,
      connectionString: postgresDb.connectionString,
      createIfNotExists: true,
    });
    httpCtx = getContext(adapter, {
      connectionString: postgresDb.connectionString,
      createIfNotExists: true,
      migrationTree: new MigrationTree('http', [
        {
          id: 'init',
          steps: [
            {
              kind: 'add_rule',
              rule: allow(authorized(), {
                select: now(),
              }),
              ruleId: getRuleId(
                allow(authorized(), {
                  select: now(),
                }),
              ),
            },
          ],
        },
      ]),
    });

    authApp = getServer((port) => createAuthApp(authCtx, port));
    authAdminApp = getServer((port) => createAuthAdminApp(authCtx, port));
    httpApp = getServer((port) =>
      createHttpServerApp(
        {
          context: httpCtx,
          enableTransactions: true,
          authorization: {
            providers: [
              {
                issuer: 'default',
                uri: `http://localhost:${authApp.port}`,
              },
            ],
            tokenEndpoints: [
              {
                uri: `http://localhost:${authAdminApp.port}`,
                issuer: 'default',
              },
            ],
          },
          cors: false,
        },
        port,
      ),
    );

    await authCtx.migrate();
    await createDefaultUserPool(authCtx);
    await createDefaultUser(authCtx);

    await authApp.start();
    await authAdminApp.start();
    await httpApp.start();
  });

  it('should push unauthorized event', async () => {
    const res = await httpPost(httpApp, `/api/iwent/event/test`, {
      payload: {},
      id: 'abc',
    });
    expect(res.statusCode).toEqual(200);
  });
});
