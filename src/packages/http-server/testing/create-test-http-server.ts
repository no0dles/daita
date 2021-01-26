import { getServer, HttpServerApp } from '../../node/testing/http-server';
import { getContext } from '../../orm';
import { MigrationTree } from '../../orm/migration/migration-tree';
import { createHttpServerApp } from '../app';
import { AuthServerTestDisposable } from '../../auth-server/testing/admin-server.test';
import { RelationalMigrationAdapterImplementation } from '../../orm/adapter/relational-migration-adapter-implementation';

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
