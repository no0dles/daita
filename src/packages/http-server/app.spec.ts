import { createHttpServerApp } from './app';
import { createDefaultUser, createDefaultUserPool, loginWithDefaultUser } from '../../testing/auth-test';
import { getServer, httpGet, httpPost, HttpServerApp } from '../../testing/http-server';
import { createAuthApp } from '../auth-server/app';
import { allow } from '../relational/permission/function/allow';
import { select } from '../relational/sql/dml/select/select';
import { authorized } from '../relational/permission/function/authorized';
import { now } from '../relational/sql/function/date/now/now';
import { authSchema } from '../auth-server/schema';
import { createAuthAdminApp } from '../auth-server/admin-app';
import { migrate } from '../orm/migration/migrate';
import { getClient } from '../relational/client/get-client';
import { MigrationClient } from '../relational/client/migration-client';
import { getPostgresDb, PostgresDb } from '../../testing/postgres-test';
import { adapter } from '../pg-adapter';

describe('http-server/app', () => {
  let client: MigrationClient<any>;
  let postgresDb: PostgresDb;
  let authApp: HttpServerApp;
  let authAdminApp: HttpServerApp;
  let httpApp: HttpServerApp;

  beforeAll(async () => {
    postgresDb = await getPostgresDb();
    client = getClient(adapter, {
      connectionString: postgresDb.connectionString,
      createIfNotExists: true,
    });
    authApp = getServer(createAuthApp(client));
    authAdminApp = getServer(createAuthAdminApp(client));
    httpApp = getServer(
      createHttpServerApp(client, {
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
        rules: [
          allow(
            authorized(),
            select({
              select: now(),
            }),
          ),
        ],
      }),
    );

    await migrate(client, authSchema);
    await createDefaultUserPool(client);
    await createDefaultUser(client);

    await authApp.start();
    await authAdminApp.start();
    await httpApp.start();
  });

  afterAll(async () => {
    await authApp.close();
    await authAdminApp.close();
    await httpApp.close();
    await client.close();
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
});
