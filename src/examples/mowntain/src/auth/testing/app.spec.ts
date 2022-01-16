import { allow, authorized, getRuleId, now } from '@daita/relational';
import { httpGet, httpPost, sqliteTestAdapter } from '@daita/testing';
import { AuthServerTestDisposable, createTestAdminServer } from './admin-server.test';
import { loginWithDefaultUser } from './auth-test';
import { createTestHttpServer, HttpTestServerDisposable } from '@daita/testing';

describe('http-server/app', () => {
  let authServerTest: AuthServerTestDisposable;
  let httpServer: HttpTestServerDisposable;

  const adapter = sqliteTestAdapter.getRelationalAdapter({
    type: 'memory',
  });

  beforeAll(async () => {
    authServerTest = await createTestAdminServer({
      adapter,
    });
    httpServer = await createTestHttpServer({
      adapter,
      authServer: {
        authPort: authServerTest.authHttp.port,
        adminPort: authServerTest.adminHttp.port,
      },
      rules: [
        {
          id: 'test',
          rule: allow(authorized(), {
            select: now(),
          }),
        },
      ],
    });
  });

  afterAll(async () => {
    await httpServer.close();
    await authServerTest.close();
    await adapter.close();
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
