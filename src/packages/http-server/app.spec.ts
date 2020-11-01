import { createHttpServerApp } from './app';
import { clientTest } from '../../testing/client-test';
import { createDefaultUser, createDefaultUserPool, loginWithDefaultUser } from '../../testing/auth-test';
import { getServer, httpGet, httpPost } from '../../testing/http-server';
import { createAuthApp } from '../auth/app';
import { allow } from '../relational/permission/function/allow';
import { select } from '../relational/sql/function/select';
import { authorized } from '../relational/permission/function/authorized';
import { now } from '../relational/sql/function/now';
import { authSchema } from '../auth/schema';
import { createAuthAdminApp } from '../auth/admin-app';
import { migrate } from '../orm/migration/migrate';

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
