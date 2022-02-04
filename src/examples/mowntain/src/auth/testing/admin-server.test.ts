import { getServer, HttpServerApp } from '@daita/testing';
import { createDefaultUser, createDefaultUserPool } from './auth-test';
import { authSchema } from '@daita/auth';
import { createAuthAdminApp, createAuthApp } from '@daita/auth-server';
import { RelationalAdapter } from '@daita/relational';
import { migrate, RelationalOrmAdapter } from '@daita/orm';

export async function createTestAdminServer(options: {
  adapter: RelationalAdapter<any> & RelationalOrmAdapter;
}): Promise<AuthServerTestDisposable> {
  const authApp = getServer((port) => createAuthApp(options.adapter, port));
  const authAdminApp = getServer((port) => createAuthAdminApp(options.adapter, port));

  await migrate(options.adapter, authSchema);
  await createDefaultUserPool(options.adapter);
  await createDefaultUser(options.adapter);

  await authApp.start();
  await authAdminApp.start();

  return {
    adminHttp: authAdminApp,
    authHttp: authApp,
    close: async () => {
      await authApp.close();
      await authAdminApp.close();
    },
  };
}

export interface AuthServerTestDisposable {
  adminHttp: HttpServerApp;
  authHttp: HttpServerApp;
  close(): Promise<void>;
}
