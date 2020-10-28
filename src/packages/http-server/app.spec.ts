import { createHttpServerApp } from './app';
import { authSchema, createAuthAdminApp, createAuthApp } from '../auth';
import { clientTest } from '../../testing/client-test';
import { createDefaultUser, createDefaultUserPool, loginWithDefaultUser } from '../../testing/auth-test';
import { migrate } from '../orm/migration';
import { getServer, httpGet, httpPost } from '../../testing/http-server';
import { allow, authorized } from '../relational/permission/function';
import { now, select } from '../relational/sql/function';

describe(
  'http-server/app',
  clientTest((client) => {
    const authApp = getServer(createAuthApp(client));
    const authAdminApp = getServer(createAuthAdminApp(client));
    const httpApp = getServer(
      createHttpServerApp(client, {
        authorization: {
          providers: [
            {
              issuer: 'default',
              uri: `http://localhost:${authApp.port}/.well-known/jwks.json`,
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

    beforeAll(async () => {
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
  }),
);
