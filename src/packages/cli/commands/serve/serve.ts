import { getContextFromConfig } from '../../utils/data-adapter';
import { getSchemaInformation, getSchemaLocation } from '../../utils/path';
import { getAuthorization } from '../../utils/authorization';
import { watch, FSWatcher } from 'chokidar';
import { applyMigration } from '../apply-migration/apply-migration';
import { getProjectConfig } from '../../utils/config';
import { createAuthApp } from '../../../auth-server/app';
import { createHttpServerApp } from '../../../http-server/app';
import { anonymous } from '../../../relational/permission/function/anonymous';
import { seedUserPool, seedUserPoolCors } from '../../../auth-server/seed';
import { Debouncer } from '../../../common/utils/debouncer';
import { anything } from '../../../relational/permission/function/anything';
import { AstContext } from '../../ast/ast-context';
import { Rule } from '../../../relational/permission/description/rule';
import { Defer } from '../../../common/utils/defer';
import { isMigrationContext } from '../../../orm/context/get-migration-context';
import { isTransactionContext } from '../../../orm/context/transaction-context';
import { authSchema } from '../../../auth-server';

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
    console.log('reload');
    await applyMigration(opts);
    //TODO reload rules
  }, 500);

  const rules: Rule[] = [];
  if (disableAuth) {
    rules.push({ auth: anonymous(), type: 'allow', sql: anything() });
  } else {
    if (schemaInfo) {
      const migrationTree = schemaInfo.getMigrationTree();
      rules.push(...migrationTree.getSchemaDescription().rulesList);
    }
  }

  let watcher: FSWatcher | undefined = undefined;
  if (!opts.disableWatch) {
    watcher = watch(schemaLocation.migrationDirectory).on('all', async (event, path) => {
      reloadDebouncer.bounce();
    });
  }

  const httpApp = createHttpServerApp(ctx, {
    authorization,
    cors: true,
  });

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
    const authApp = createAuthApp(ctx);
    const authPort = opts.authPort || 8766;

    authServer = authApp.listen(authPort, () => {
      console.log(`auth api listening on http://localhost:${authPort}`);
    });
  }

  const closeDefer = new Defer<void>();
  const resultDefer = new Defer<void>();
  const readyDefer = new Defer<void>();

  const httpPort = opts.port || 8765;
  const server = httpApp.listen(httpPort, () => {
    console.log(`api listening on http://localhost:${httpPort}`);
    readyDefer.resolve();
  });

  closeDefer.promise.then(async () => {
    reloadDebouncer.clear();
    server?.close();
    authServer?.close();
    await watcher?.close();
    await ctx?.close();
    resultDefer.resolve();
  });

  process.on('SIGINT', async () => {
    closeDefer.resolve();
  });

  return {
    cancel: () => {
      closeDefer.resolve();
    },
    ready: readyDefer.promise,
    result: resultDefer.promise,
  };
}
