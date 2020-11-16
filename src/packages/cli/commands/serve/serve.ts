import { getContextFromConfig } from '../../utils/data-adapter';
import { getSchemaInformation, getSchemaLocation } from '../../utils/path';
import { getAuthorization } from '../../utils/authorization';
import { watch, FSWatcher } from 'chokidar';
import { applyMigration } from '../apply-migration/apply-migration';
import { getProjectConfig } from '../../utils/config';
import { createAuthApp } from '../../../auth-server/app';
import { createHttpServerApp } from '../../../http-server/app';
import { seedUserPool, seedUserPoolCors } from '../../../auth-server/seed';
import { Debouncer } from '../../../common/utils/debouncer';
import { AstContext } from '../../ast/ast-context';
import { Defer } from '../../../common/utils/defer';
import { isMigrationContext } from '../../../orm/context/get-migration-context';
import { isTransactionContext } from '../../../orm/context/transaction-context';
import { createLogger } from '../../../common/utils/logger';
import { AppOptions } from '../../../http-server-common/app-options';
import { authSchema } from '../../../auth-server/schema';

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

  if (isMigrationContext(ctx)) {
    await ctx.migrate();
  }

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
  const httpOptions: AppOptions = {
    context: ctx,
    authorization,
    cors: true,
  };
  const server = await createHttpServerApp(httpOptions, httpPort);

  let authServer: any;
  if (!disableAuth) {
    const ctx = getContextFromConfig(opts, authSchema.getMigrations());
    if (!isTransactionContext(ctx)) {
      throw new Error('authorization api requires a transaction capable adapter');
    }
    if (isMigrationContext(ctx)) {
      await ctx.migrate();
    }
    await seedUserPool(ctx, {
      id: 'cli',
      name: 'cli',
      accessTokenExpiresIn: 600,
      algorithm: 'RS256',
      allowRegistration: true,
      checkPasswordForBreach: false,
      emailVerifyExpiresIn: 3600,
      refreshRefreshExpiresIn: 3600,
    });

    const corsUrls = (contextConfig.authorization && contextConfig.authorization.cors) || [];
    await seedUserPoolCors(ctx, 'cli', corsUrls);
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
