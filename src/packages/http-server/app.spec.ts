import { createHttpServerApp } from './app';
import { authSchema, createAuthApp } from '../auth';
import { clientTest } from '../../testing/client-test';
import {
  createDefaultUser,
  createDefaultUserPool,
  login,
  loginWithDefaultUser,
} from '../../testing/auth-test';
import { migrate } from '../orm/migration';
import { getServer, httpGet, httpPost } from '../../testing/http-server';
import { allow, authorized } from '../relational/permission/function';
import { now, select } from '../relational/sql/function';

describe(
  'http-server/app',
  clientTest((client) => {
    const authApp = getServer(createAuthApp(client));
    const httpApp = getServer(
      createHttpServerApp(client, {
        authorization: {
          providers: [
            {
              issuer: 'default',
              uri: `http://localhost:${authApp.port}/.well-known/jwks.json`,
            },
          ],
          tokens: [],
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
      await httpApp.start();
    });

    afterAll(async () => {
      await authApp.close();
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

    it('should', async () => {
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
      console.log(res);
    });
  }),
);
