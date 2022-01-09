import { getContext } from '@daita/orm';
import { RelationalMigrationAdapterImplementation } from '@daita/orm';
import { getServer, HttpServerApp } from '@daita/testing';
import { createDefaultUser, createDefaultUserPool } from './auth-test';
import { authSchema } from '@daita/auth';
import { createAuthAdminApp, createAuthApp } from '@daita/auth-server';

export async function createTestAdminServer<TOptions>(options: {
  adapter: RelationalMigrationAdapterImplementation<any, TOptions>;
  options: TOptions;
}): Promise<AuthServerTestDisposable> {
  const authCtx = getContext(options.adapter, {
    schema: authSchema,
    ...options.options,
  });
  const authApp = getServer((port) => createAuthApp(authCtx, port));
  const authAdminApp = getServer((port) => createAuthAdminApp(authCtx, port));

  await authCtx.migrate();
  await createDefaultUserPool(authCtx);
  await createDefaultUser(authCtx);

  await authApp.start();
  await authAdminApp.start();

  return {
    adminHttp: authAdminApp,
    authHttp: authApp,
    close: async () => {
      await authApp.close();
      await authAdminApp.close();
      await authCtx.close();
    },
  };
}

export interface AuthServerTestDisposable {
  adminHttp: HttpServerApp;
  authHttp: HttpServerApp;
  close(): Promise<void>;
}