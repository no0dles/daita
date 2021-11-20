import { getServer, HttpServerApp } from '@daita/node';
import { getContext } from '@daita/orm';
import { MigrationTree } from '@daita/orm';
import { createHttpServerApp } from '../app';
import { AuthServerTestDisposable } from '@daita/auth-server';
import { RelationalMigrationAdapterImplementation } from '@daita/orm';

export async function createTestHttpServer<TOps>(options: {
  authServer?: AuthServerTestDisposable;
  adapter: RelationalMigrationAdapterImplementation<any, TOps>;
  options: TOps;
  migrationTree: MigrationTree;
}): Promise<HttpTestServerDisposable> {
  const httpCtx = getContext(options.adapter, {
    ...options.options,
    migrationTree: options.migrationTree,
  });

  const httpApp = getServer((port) =>
    createHttpServerApp(
      {
        relational: {
          context: httpCtx,
          enableTransactions: true,
        },
        authorization: {
          providers: options.authServer
            ? [
                {
                  issuer: 'default',
                  uri: `http://localhost:${options.authServer.authHttp.port}`,
                },
              ]
            : [],
          tokenEndpoints: options.authServer
            ? [
                {
                  uri: `http://localhost:${options.authServer.adminHttp.port}`,
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
      await httpCtx.close();
    },
  };
}

export interface HttpTestServerDisposable {
  http: HttpServerApp;
  close(): Promise<void>;
}
