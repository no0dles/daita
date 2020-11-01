import { getClientFromConfig } from '../utils/data-adapter';
import { getSchemaLocation } from '../utils/path';
import { getAuthorization } from '../utils/authorization';
import { createHttpServerApp } from '../../http-server';
import { anonymous, anything } from '../../relational/permission/function';
import { Rule } from '../../relational/permission/description';
import { watch, FSWatcher } from 'chokidar';
import { authSchema, createAuthApp, seedUserPool, seedUserPoolCors } from '../../auth';
import { migrate } from '../../orm/migration';
import { Debouncer } from '../../common/utils';
import { applyMigration } from './apply-migration';
import { OrmRuleContext } from '../../orm/context';
import { getProjectConfig } from '../utils/config';

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

  const rules: Rule[] = [];
  const authorization = getAuthorization(opts);
  const disableAuth = !authorization || opts.disableAuth;

  const schemaLocation = await getSchemaLocation(opts);
  const reloadDebouncer = new Debouncer(async () => {
    console.log('reload');
    await applyMigration(opts);

    if (!disableAuth) {
      await updateRules();
    }
  }, 500);

  async function updateRules() {
    const ruleContext = new OrmRuleContext(client);
    const newRules = await ruleContext.getRules();
    rules.splice(0, rules.length);
    rules.push(...newRules);
  }

  if (disableAuth) {
    rules.push({ auth: anonymous(), type: 'allow', sql: anything() });
  } else {
    await updateRules();
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
    await migrate(client, authSchema);
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
