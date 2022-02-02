import { DaitaAuthorizationIssuerConfig, getContextFromConfig } from '../../utils/data-adapter';
import { getSchemaInformation, getSchemaLocation } from '../../utils/path';
import { getAuthorization } from '../../utils/authorization';
import { watch, FSWatcher } from 'chokidar';
import { applyMigration } from '../apply-migration/apply-migration';
import { getProjectConfig } from '../../utils/config';
import { createAuthApp, hashPassword } from '@daita/auth-server';
import { createHttpServerApp } from '@daita/http-server';
import { seedPoolUser, seedRoles, seedUserPool, seedUserPoolCors, seedUserRole } from '@daita/auth-server';
import { Debouncer, ExcludeNonPrimitive } from '@daita/common';
import { AstContext } from '../../ast/ast-context';
import { Defer } from '@daita/common';
import { createLogger } from '@daita/common';
import { HttpServerOptions } from '@daita/http-server';
import { authSchema, Role, User, UserPool, UserRole } from '@daita/auth';
import { migrate, RelationalOrmAdapter } from '@daita/orm';
import { RelationalAdapter } from '@daita/relational';

const logger = createLogger({ package: 'cli', command: 'serve' });
export async function serve(opts: {
  cwd?: string;
  schema?: string;
  port?: number;
  context?: string;
  authPort?: number;
  disableAuth?: boolean;
  disableWatch?: boolean;
}) {
  const contextConfig = getProjectConfig(opts);
  const schemaLocation = await getSchemaLocation(opts);
  const astContext = new AstContext();
  const schemaInfo = await getSchemaInformation(astContext, schemaLocation);
  if (!schemaInfo) {
    throw new Error('could not parse schema');
  }

  const adapter = getContextFromConfig(opts);
  if (!adapter) {
    throw new Error('no relational adapter');
  }

  await migrate(adapter, schemaInfo.getMigrationTree());

  const authorization = getAuthorization(opts);
  const disableAuth = !authorization || opts.disableAuth;

  const reloadDebouncer = new Debouncer(async () => {
    logger.info('reloading source code');
    await applyMigration(opts);
    //TODO reload rules
  }, 500);

  let watcher: FSWatcher | undefined = undefined;
  if (!opts.disableWatch) {
    watcher = watch(schemaLocation.migrationDirectory).on('all', () => {
      reloadDebouncer.bounce();
    });
  }

  const httpPort = opts.port || 8765;
  const httpOptions: HttpServerOptions = {
    relational: {
      dataAdapter: adapter,
      enableTransactions: true,
    },
    authorization: disableAuth ? false : authorization,
    cors: true,
  };
  const server = await createHttpServerApp(httpOptions, httpPort);

  let authServer: any;
  if (!disableAuth) {
    await migrate(adapter, authSchema);

    const userPools = contextConfig.authorization?.userPools || {};
    await setupAuth(adapter, userPools);

    const authPort = opts.authPort || 8766;
    authServer = await createAuthApp(adapter, authPort);
  }

  const closeDefer = new Defer<void>();
  const closedDefer = new Defer<void>();
  closeDefer.promise.then(async () => {
    try {
      logger.info('closing...');
      reloadDebouncer.clear();
      server?.close();
      authServer?.close();
      await watcher?.close();
      await adapter?.close();
      closedDefer.resolve();
    } catch (e) {
      closedDefer.reject(e);
    }
  });

  process.on('SIGINT', async () => {
    closeDefer.resolve();
  });

  return {
    cancel: () => {
      closeDefer.resolve();
      return closedDefer.promise;
    },
  };
}

async function setupAuth(
  adapter: RelationalAdapter<any> & RelationalOrmAdapter,
  config: { [key: string]: DaitaAuthorizationIssuerConfig },
) {
  const userPools: ExcludeNonPrimitive<UserPool>[] = [];
  const users: ExcludeNonPrimitive<User>[] = [];
  const roles: ExcludeNonPrimitive<Role>[] = [];
  const userRoles: ExcludeNonPrimitive<UserRole>[] = [];
  const userPoolCors: { cors: string[]; userPoolId: string }[] = [];

  for (const issuerKey of Object.keys(config)) {
    const issuer = config[issuerKey];
    userPools.push({
      id: issuerKey,
      name: issuer.name || issuerKey,
      accessTokenExpiresIn: issuer.accessTokenExpiresIn ?? 600,
      algorithm: issuer.algorithm ?? 'RS256',
      allowRegistration: issuer.allowRegistration ?? true,
      checkPasswordForBreach: issuer.checkPasswordForBreach ?? false,
      emailVerifyExpiresIn: issuer.emailVerifyExpiresIn ?? 3600,
      refreshRefreshExpiresIn: issuer.refreshRefreshExpiresIn ?? 3600,
    });

    userPoolCors.push({
      cors: issuer.cors || [],
      userPoolId: issuerKey,
    });

    const rolesMap = issuer.roles || {};
    for (const roleKey of Object.keys(rolesMap)) {
      roles.push({
        name: roleKey,
        description: rolesMap[roleKey].description,
        userPoolId: issuerKey,
      });
    }

    const userMap = issuer.users || {};
    for (const userKey of Object.keys(userMap)) {
      const user = userMap[userKey];
      users.push({
        password: await hashPassword(user.password),
        username: userKey,
        emailVerified: user.emailVerified ?? true,
        phone: user.phone,
        phoneVerified: user.phoneVerified ?? true,
        userPoolId: issuerKey,
        email: user.email,
        disabled: user.disabled ?? false,
      });

      for (const role of user.roles || []) {
        userRoles.push({
          roleUserPoolId: issuerKey,
          roleName: role,
          userUsername: userKey,
        });
      }
    }
  }

  await adapter.transaction((trx) => {
    for (const userPool of userPools) {
      seedUserPool(trx, userPool);
    }
    for (const cor of userPoolCors) {
      seedUserPoolCors(trx, cor.userPoolId, cor.cors);
    }
    for (const role of roles) {
      seedRoles(trx, role);
    }
    for (const user of users) {
      seedPoolUser(trx, user);
    }
    for (const userRole of userRoles) {
      seedUserRole(trx, userRole);
    }
  });
}
