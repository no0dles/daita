import { migrate, RelationalOrmAdapter } from '@daita/orm';
import { RelationalAdapter } from '@daita/relational';
import { getServer, NodeHttp } from '@daita/node';
import { createAuthApp, hashPassword, seedPoolUser, seedRoles, seedUserPool, seedUserRole } from '@daita/auth-server';
import { authSchema } from '@daita/auth';

export interface AuthTest {
  http: NodeHttp;
  address: string;
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
  const authServer = await getServer(authApp);
  const http = new NodeHttp(authServer.address, null);

  return {
    http,
    address: authServer.address,
    async close(): Promise<void> {
      await authServer.server.close();
    },
  };
}
