import { loginWithDefaultUser } from '../../testing/auth-test';
import { httpGet, httpPost, HttpServerApp } from '@daita/node/testing/http-server';
import { now } from '../relational/sql/function/date/now/now';
import { adapter } from '../pg-adapter';
import { getPostgresDb, PostgresDb } from '../pg-adapter/testing/postgres-test-adapter';
import { createTestAdminServer, AuthServerTestDisposable } from '../auth-server/testing/admin-server.test';
import { createTestHttpServer, HttpTestServerDisposable } from './testing/create-test-http-server.test';
import { MigrationTree } from '@daita/orm/migration/migration-tree';
import { allow, authorized } from '../relational';
import { getRuleId } from '../relational/permission/rule-id';

describe('http-server/app', () => {
  let authServerTest: AuthServerTestDisposable;
  let httpServer: HttpTestServerDisposable;
  let postgresDb: PostgresDb;

  beforeAll(async () => {
    postgresDb = await getPostgresDb();
    authServerTest = await createTestAdminServer({
      adapter,
      options: {
        createIfNotExists: true,
        connectionString: postgresDb.connectionString,
      },
    });
    httpServer = await createTestHttpServer({
      adapter,
      options: {
        createIfNotExists: true,
        connectionString: postgresDb.connectionString,
      },
      authServer: authServerTest,
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
  });

  afterAll(async () => {
    await httpServer.close();
    await authServerTest.close();
    await postgresDb.close();
  });

  it('should login', async () => {
    const res = await httpPost(authServerTest.authHttp, `/default/login`, {
      username: 'user',
      password: '123456',
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).not.toBeNull();
    expect(res.body).not.toBeUndefined();
    expect(res.body.token_type).toEqual('bearer');
  });

  it('should handle malformed bearer token', async () => {
    const res = await httpGet(httpServer.http, '', {
      headers: { Authorization: 'Bearer asd' },
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ message: 'invalid token format' });
  });

  it('should login with token', async () => {
    const accessToken = await loginWithDefaultUser(authServerTest.authHttp);
    const tokenRes = await httpPost(
      authServerTest.authHttp,
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
      httpServer.http,
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
    const token = await loginWithDefaultUser(authServerTest.authHttp);
    const res = await httpPost(
      httpServer.http,
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
    const token = await loginWithDefaultUser(authServerTest.authHttp);
    const res = await httpPost(
      httpServer.http,
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
    const res = await httpPost(httpServer.http, '/api/relational/exec', {
      sql: {
        select: now(),
      },
    });
    expect(res.statusCode).toEqual(403);
  });
});
