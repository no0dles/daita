import { RelationalOrmAdapter } from '@daita/orm';
import { createHttpServerApp } from '@daita/http-server';
import { RelationalAdapter, Rule } from '@daita/relational';
import { getServer, NodeHttp } from '@daita/node';
import { createToken } from '@daita/auth-server';
import { createTestAuthServer } from './auth-test-server';

export interface HttpTest {
  http: NodeHttp;
  authorized: (username: string) => NodeHttp;
  close(): Promise<void>;
}

export async function createTestHttpServer(
  adapter: RelationalAdapter<any> & RelationalOrmAdapter,
  options: {
    rules?: { id: string; rule: Rule }[];
  },
): Promise<HttpTest> {
  const auth = await createTestAuthServer(adapter, {});

  const httpApp = createHttpServerApp({
    relational: {
      dataAdapter: adapter,
    },
    authorization: {
      rules: options.rules ?? 'disabled',
      providers: [
        {
          issuer: 'test',
          uri: auth.address,
        },
      ],
      tokenEndpoints: [
        {
          uri: auth.address,
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
    authorized: (username) =>
      new NodeHttp(httpServer.address, {
        getToken: () => {
          return createToken(adapter, {
            name: 'test',
            userPoolId: 'test',
            username,
          });
        },
      }),
    async close(): Promise<void> {
      await httpServer.server.close();
    },
  };
}
