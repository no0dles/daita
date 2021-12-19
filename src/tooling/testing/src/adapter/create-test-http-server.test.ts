import { getContext } from '@daita/orm';
import { MigrationTree } from '@daita/orm';
import { RelationalMigrationAdapterImplementation } from '@daita/orm';
import { createHttpServerApp } from '@daita/http-server';
import { getServer, HttpServerApp } from './http-server';

export async function createTestHttpServer<TOps>(options: {
  authServer?: { adminPort: number; authPort: number };
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
      await httpCtx.close();
    },
  };
}

export interface HttpTestServerDisposable {
  http: HttpServerApp;
  close(): Promise<void>;
}
