import { getContextFromConfig } from '../../utils/data-adapter';
import { getSchemaInformation, getSchemaLocation } from '../../utils/path';
import { getAuthorization } from '../../utils/authorization';
import { watch, FSWatcher } from 'chokidar';
import { applyMigration } from '../apply-migration/apply-migration';
import { getProjectConfig } from '../../utils/config';
import { createAuthApp } from '@daita/auth-server/app';
import { createHttpServerApp } from '@daita/http-server/app';
import { seedPoolUser, seedRoles, seedUserPool, seedUserPoolCors, seedUserRole } from '@daita/auth-server/seed';
import { Debouncer } from '@daita/common/utils/debouncer';
import { AstContext } from '../../ast/ast-context';
import { Defer } from '@daita/common/utils/defer';
import { isTransactionContext } from '@daita/orm/context/transaction-context';
import { createLogger } from '@daita/common/utils/logger';
import { HttpServerOptions } from '@daita/http-server-common/http-server-options';
import { authSchema } from '@daita/auth-server/schema';

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

  const ctx = getContextFromConfig(opts, schemaInfo.getMigrationTree());
  if (!ctx) {
    throw new Error('no relational adapter');
  }

  await ctx.migrate();

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
      context: ctx,
      enableTransactions: true,
    },
    authorization: disableAuth ? false : authorization,
    cors: true,
  };
  const server = await createHttpServerApp(httpOptions, httpPort);

  let authServer: any;
  if (!disableAuth) {
    const ctx = getContextFromConfig(opts, authSchema.getMigrations());
    if (!isTransactionContext(ctx)) {
      throw new Error('authorization api requires a transaction capable adapter');
    }
    await ctx.migrate();

    const userPools = contextConfig.authorization?.userPools || {};
    for (const issuerKey of Object.keys(userPools)) {
      const issuer = userPools[issuerKey];

      // TODO remove userpools
      await seedUserPool(ctx, {
        id: issuerKey,
        name: issuer.name || issuerKey,
        accessTokenExpiresIn: issuer.accessTokenExpiresIn ?? 600,
        algorithm: issuer.algorithm ?? 'RS256',
        allowRegistration: issuer.allowRegistration ?? true,
        checkPasswordForBreach: issuer.checkPasswordForBreach ?? false,
        emailVerifyExpiresIn: issuer.emailVerifyExpiresIn ?? 3600,
        refreshRefreshExpiresIn: issuer.refreshRefreshExpiresIn ?? 3600,
      });

      await seedUserPoolCors(ctx, issuerKey, issuer.cors || []);

      // TODO remove roles
      const roles = issuer.roles || {};
      for (const roleKey of Object.keys(roles)) {
        await seedRoles(ctx, {
          name: roleKey,
          description: roles[roleKey].description,
          userPoolId: issuerKey,
        });
      }

      // TODO remove users
      const users = issuer.users || {};
      for (const userKey of Object.keys(users)) {
        const user = users[userKey];
        await seedPoolUser(ctx, {
          password: user.password,
          username: userKey,
          emailVerified: user.emailVerified ?? true,
          phone: user.phone,
          phoneVerified: user.phoneVerified ?? true,
          userPoolId: issuerKey,
          email: user.email,
          disabled: user.disabled ?? false,
        });
        // TODO remove user roles
        for (const role of user.roles || []) {
          await seedUserRole(ctx, {
            roleUserPoolId: issuerKey,
            roleName: role,
            userUsername: userKey,
          });
        }
      }
    }

    const authPort = opts.authPort || 8766;
    authServer = await createAuthApp(ctx, authPort);
  }

  const closeDefer = new Defer<void>();

  closeDefer.promise.then(async () => {
    logger.info('closing...');
    reloadDebouncer.clear();
    server?.close();
    authServer?.close();
    await watcher?.close();
    await ctx?.close();
  });

  process.on('SIGINT', async () => {
    closeDefer.resolve();
  });

  return {
    cancel: () => {
      closeDefer.resolve();
    },
  };
}
