import { RelationalOrmAdapter } from '@daita/orm';
import { createHttpServerApp } from '@daita/http-server';
import { RelationalAdapter, Rule } from '@daita/relational';
import { getServer, NodeHttp } from '@daita/node';
import { createToken, getAccessToken } from '@daita/auth-server';
import { createTestAuthServer } from './auth-test-server';

export interface HttpTest {
  http: NodeHttp;
  authorized: (username: string, roles: string[]) => NodeHttp;
  authorizedToken: (username: string) => NodeHttp;
  close(): Promise<void>;
}

export async function createTestHttpServer(
  adapter: RelationalAdapter<any> & RelationalOrmAdapter,
  options: {
    rules?: { id: string; rule: Rule }[];
  },
): Promise<HttpTest> {
  const auth = await createTestAuthServer(adapter, {
    auth: { username: 'test', password: '12356', roles: [] },
  });

  const httpApp = createHttpServerApp({
    relational: {
      dataAdapter: adapter,
    },
    authorization: {
      rules: options.rules ?? 'disabled',
      providers: [
        {
          issuer: 'test',
          uri: auth.authAddress,
        },
      ],
      tokenEndpoints: [
        {
          uri: auth.adminAddress,
          issuer: 'test',
        },
      ],
    },
    cors: false,
  });
  const httpServer = await getServer(httpApp);
  const http = new NodeHttp(httpServer.address, null);

  return {
    http,
    authorized: (username, roles) =>
      new NodeHttp(httpServer.address, {
        getToken: async () => {
          return `Bearer ${await getAccessToken(
            'test',
            {
              roles,
            },
            {
              subject: username,
              expiresIn: 3600,
              issuer: 'test',
              algorithm: 'RS256',
            },
          )}`;
        },
      }),
    authorizedToken: (username) =>
      new NodeHttp(httpServer.address, {
        getToken: async () => {
          return `Token ${await createToken(adapter, {
            name: 'test',
            userPoolId: 'test',
            username,
          })}`;
        },
      }),
    async close(): Promise<void> {
      await httpServer.server.close();
    },
  };
}
