import { getClientFromConfig } from '../utils/data-adapter';
import { getSchemaInformation, getSchemaLocation } from '../utils/path';
import { getAuthorization } from '../utils/authorization';
import { watch, FSWatcher } from 'chokidar';
import { applyMigration } from './apply-migration';
import { getProjectConfig } from '../utils/config';
import { createAuthApp } from '../../auth/app';
import { createHttpServerApp } from '../../http-server/app';
import { authSchema } from '../../auth/schema';
import { anonymous } from '../../relational/permission/function/anonymous';
import { seedUserPool, seedUserPoolCors } from '../../auth/seed';
import { Debouncer } from '../../common/utils/debouncer';
import { migrate } from '../../orm/migration/migrate';
import { anything } from '../../relational/permission/function/anything';
import { RelationalMigrationClient } from '../../relational/client/relational-transaction-client';
import { AstContext } from '../ast/ast-context';
import { Rule } from '../../relational/permission/description/rule';

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
  const client = await getClientFromConfig(opts);
  if (!client) {
    throw new Error('no relational adapter');
  }

  await applyMigration(opts);

  const authorization = getAuthorization(opts);
  const disableAuth = !authorization || opts.disableAuth;

  const schemaLocation = await getSchemaLocation(opts);

  const reloadDebouncer = new Debouncer(async () => {
    console.log('reload');
    await applyMigration(opts);
    //TODO reload rules
  }, 500);

  const rules: Rule[] = [];
  if (disableAuth) {
    rules.push({ auth: anonymous(), type: 'allow', sql: anything() });
  } else {
    const astContext = new AstContext();
    const schemaInfo = await getSchemaInformation(astContext, schemaLocation);
    if (schemaInfo) {
      const migrationTree = schemaInfo.getMigrationTree();
      rules.push(...migrationTree.getSchemaDescription({ backwardCompatible: false }).rules.map((r) => r.rule));
    }
  }

  let watcher: FSWatcher | undefined = undefined;
  if (!opts.disableWatch) {
    watcher = watch(schemaLocation.migrationDirectory).on('all', async (event, path) => {
      reloadDebouncer.bounce();
    });
  }

  const httpApp = createHttpServerApp(client, {
    authorization,
    rules,
    cors: true,
  });

  let authServer: any;
  if (!disableAuth) {
    if (client instanceof RelationalMigrationClient) {
      await migrate(client, authSchema);
    }
    await seedUserPool(client, {
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
    await seedUserPoolCors(client, 'cli', corsUrls);
    const authApp = createAuthApp(client);
    const authPort = opts.authPort || 8766;

    authServer = authApp.listen(authPort, () => {
      console.log(`auth api listening on http://localhost:${authPort}`);
    });
  }

  const httpPort = opts.port || 8765;
  const server = httpApp.listen(httpPort, () => {
    console.log(`api listening on http://localhost:${httpPort}`);
  });

  process.on('SIGINT', async () => {
    reloadDebouncer.clear();
    server?.close();
    authServer?.close();
    await watcher?.close();
    await client?.close();
  });
}
