import { createHttpServerApp } from './app';
import { createDefaultUser, createDefaultUserPool, loginWithDefaultUser } from '../../testing/auth-test';
import { getServer, httpGet, httpPost, HttpServerApp } from '../../testing/http-server';
import { createAuthApp } from '../auth-server/app';
import { now } from '../relational/sql/function/date/now/now';
import { authSchema } from '../auth-server/schema';
import { createAuthAdminApp } from '../auth-server/admin-app';
import { adapter } from '../pg-adapter';
import { MigrationContext } from '../orm/context/get-migration-context';
import { getContext } from '../orm';
import { MigrationTree } from '../orm/migration/migration-tree';
import { allow, authorized } from '../relational';
import { getRuleId } from '../orm/migration/generation/rule-id';
import { getPostgresDb, PostgresDb } from '../pg-adapter/testing/postgres-test-adapter';

describe('http-server/app', () => {
  let authCtx: MigrationContext<any>;
  let httpCtx: MigrationContext<any>;
  let postgresDb: PostgresDb;
  let authApp: HttpServerApp;
  let authAdminApp: HttpServerApp;
  let httpApp: HttpServerApp;

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

  afterAll(async () => {
    await authApp.close();
    await authAdminApp.close();
    await httpApp.close();
    await authCtx.close();
    await postgresDb.close();
  });

  it('should login', async () => {
    const res = await httpPost(authApp, `/default/login`, {
      username: 'user',
      password: '123456',
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).not.toBeNull();
    expect(res.body).not.toBeUndefined();
    expect(res.body.token_type).toEqual('bearer');
  });

  it('should handle malformed bearer token', async () => {
    const res = await httpGet(httpApp, '', {
      headers: { Authorization: 'Bearer asd' },
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual({ message: 'jwt malformed' });
  });

  it('should login with token', async () => {
    const accessToken = await loginWithDefaultUser(authApp);
    const tokenRes = await httpPost(
      authApp,
      `/default/token`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const apiToken = tokenRes.body.token;
    const res = await httpPost(
      httpApp,
      '/api/relational/exec',
      {
        sql: {
          select: now(),
        },
      },
      {
        headers: { Authorization: `Token ${apiToken}` },
      },
    );
    expect(res.statusCode).toEqual(200);
    expect(res.body.rowCount).toEqual(1);
    expect(res.body.rows[0]).not.toBeUndefined();
  });

  it('should return result', async () => {
    const token = await loginWithDefaultUser(authApp);
    const res = await httpPost(
      httpApp,
      '/api/relational/exec',
      {
        sql: {
          select: now(),
        },
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    expect(res.statusCode).toEqual(200);
    expect(res.body.rowCount).toEqual(1);
    expect(res.body.rows[0]).not.toBeUndefined();
  });

  it('should not allow undefined sql', async () => {
    const token = await loginWithDefaultUser(authApp);
    const res = await httpPost(
      httpApp,
      '/api/relational/exec',
      {
        sql: {
          select: { time: now() },
        },
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    expect(res.statusCode).toEqual(403);
  });

  it('should not allow unauthorized result', async () => {
    const res = await httpPost(httpApp, '/api/relational/exec', {
      sql: {
        select: now(),
      },
    });
    expect(res.statusCode).toEqual(403);
  });
});
