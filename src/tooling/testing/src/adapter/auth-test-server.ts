import { migrate, RelationalOrmAdapter } from '@daita/orm';
import { RelationalAdapter } from '@daita/relational';
import { getServer, NodeHttp } from '@daita/node';
import {
  createAuthAdminApp,
  createAuthApp,
  createMetricsApp,
  hashPassword,
  seedPoolUser,
  seedRoles,
  seedUserPool,
  seedUserRole,
} from '@daita/auth-server';
import { authSchema } from '@daita/auth';

export interface AuthTest {
  authHttp: NodeHttp;
  adminHttp: NodeHttp;
  metricHttp: NodeHttp;
  authAddress: string;
  adminAddress: string;
  metricAddress: string;
  close(): Promise<void>;
}

export async function createTestAuthServer(
  adapter: RelationalAdapter<any> & RelationalOrmAdapter,
  options: {
    auth?: { username: string; password: string; roles: string[] };
  },
): Promise<AuthTest> {
  await migrate(adapter, authSchema);

  const auth = options.auth;
  if (auth) {
    const pwHash = await hashPassword(auth.password);
    await adapter.transaction((trx) => {
      seedUserPool(trx, {
        id: 'test',
        accessTokenExpiresIn: 3600,
        algorithm: 'RS256',
        allowRegistration: true,
        checkPasswordForBreach: false,
        emailVerifyExpiresIn: 3600,
        name: 'Test',
        passwordRegex: undefined,
        refreshRefreshExpiresIn: 3600,
      });
      seedPoolUser(trx, {
        username: auth.username,
        disabled: false,
        userPoolId: 'test',
        password: pwHash,
      });
      for (const role of auth.roles) {
        seedRoles(trx, {
          userPoolId: 'test',
          name: role,
        });
        seedUserRole(trx, {
          userUsername: auth.username,
          roleUserPoolId: 'test',
          roleName: role,
        });
      }
    });
  } else {
    await adapter.transaction((trx) => {
      seedUserPool(trx, {
        id: 'test',
        accessTokenExpiresIn: 3600,
        algorithm: 'RS256',
        allowRegistration: true,
        checkPasswordForBreach: false,
        emailVerifyExpiresIn: 3600,
        name: 'Test',
        passwordRegex: undefined,
        refreshRefreshExpiresIn: 3600,
      });
    });
  }

  const authApp = createAuthApp(adapter);
  const adminApp = createAuthAdminApp(adapter);
  const metricApp = createMetricsApp();
  const authServer = await getServer(authApp);
  const adminServer = await getServer(adminApp);
  const metricServer = await getServer(metricApp);
  const authHttp = new NodeHttp(authServer.address, null);
  const adminHttp = new NodeHttp(authServer.address, null);
  const metricHttp = new NodeHttp(metricServer.address, null);

  return {
    authHttp,
    adminHttp,
    metricHttp,
    authAddress: authServer.address,
    adminAddress: adminServer.address,
    metricAddress: metricServer.address,
    async close(): Promise<void> {
      await authServer.server.close();
    },
  };
}
