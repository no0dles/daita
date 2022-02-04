import { RelationalOrmAdapter } from '@daita/orm';
import { createHttpServerApp } from '@daita/http-server';
import { getServer, HttpServerApp } from './http-server';
import { RelationalAdapter, Rule } from '@daita/relational';

export async function createTestHttpServer(options: {
  authServer?: { adminPort: number; authPort: number };
  adapter: RelationalAdapter<any> & RelationalOrmAdapter;
  rules?: { id: string; rule: Rule }[];
}): Promise<HttpTestServerDisposable> {
  const httpApp = getServer((port) =>
    createHttpServerApp(
      {
        relational: {
          dataAdapter: options.adapter,
          enableTransactions: true,
        },
        authorization: {
          rules: options.rules ?? 'disabled',
          providers: options.authServer
            ? [
                {
                  issuer: 'default',
                  uri: `http://localhost:${options.authServer.authPort}`,
                },
              ]
            : [],
          tokenEndpoints: options.authServer
            ? [
                {
                  uri: `http://localhost:${options.authServer.adminPort}`,
                  issuer: 'default',
                },
              ]
            : [],
        },
        cors: false,
      },
      port,
    ),
  );

  await httpApp.start();

  return {
    http: httpApp,
    close: async () => {
      await httpApp.close();
    },
  };
}

export interface HttpTestServerDisposable {
  http: HttpServerApp;
  close(): Promise<void>;
}
