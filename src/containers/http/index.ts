import { adapter as pgAdapter } from '../../packages/pg-adapter/adapter/adapter';
import { adapter as sqliteAdapter } from '../../packages/sqlite-adapter';
import { getContext } from '../../packages/orm/context/get-context';
import { RelationalMigrationAdapterImplementation } from '../../packages/orm/adapter/relational-migration-adapter-implementation';
import { createLogger } from '../../packages/common/utils/logger';
import { HttpServerAuthorization } from '../../packages/http-server-common/http-server-authorization';
import fs from 'fs';
import { Application } from '../../packages/node/application';
import { createHttpServerApp } from '../../packages/http-server/app';
import {
  getBoolEnvironmentVariable,
  getEnvironmentVariable,
  getNumberEnvironmentVariable,
} from '../../packages/common/utils/environment';
import { isIwentAdapter } from '../../packages/iwent/iwent-adapter';

const DATABASE_URL = getEnvironmentVariable('DATABASE_URL', './http.db');
const AUTH_FILE = getEnvironmentVariable('AUTH_FILE', 'auth.json');
const SCHEMA_NAME = getEnvironmentVariable('SCHEMA_NAME', 'default');
const TRANSACTION_TIMEOUT = getNumberEnvironmentVariable('TRANSACTION_TIMEOUT', 4000);
const TRANSACTION_ENABLED = getBoolEnvironmentVariable('TRANSACTION_ENABLED', true);
const IWENT_ENABLED = getBoolEnvironmentVariable('IWENT_ENABLED', true);
const RELATIONAL_ENABLED = getBoolEnvironmentVariable('RELATIONAL_ENABLED', true);
const PORT = getNumberEnvironmentVariable('PORT', 3000);

const logger = createLogger({ container: 'http' });
logger.info(`TRANSACTION_TIMEOUT=${TRANSACTION_TIMEOUT}`);
logger.info(`AUTH_FILE=${AUTH_FILE}`);
logger.info(`PORT=${PORT}`);
logger.debug(`DATABASE_URL=${DATABASE_URL}`); // TODO redact pw, use logger

const adapter: RelationalMigrationAdapterImplementation<any, any> = DATABASE_URL.startsWith('postgres')
  ? pgAdapter
  : sqliteAdapter;

const context = getContext(adapter, {
  connectionString: DATABASE_URL,
  schemaName: SCHEMA_NAME,
});

const authentication: HttpServerAuthorization = { providers: [] };
if (fs.existsSync(AUTH_FILE)) {
  const content = fs.readFileSync(AUTH_FILE, { encoding: 'utf8' });
  try {
    const parsedAuthentication = JSON.parse(content);
    authentication.tokenEndpoints =
      parsedAuthentication && parsedAuthentication.tokenEndpoints ? parsedAuthentication.tokenEndpoints : [];
    authentication.providers =
      parsedAuthentication && parsedAuthentication.providers ? parsedAuthentication.providers : [];
  } catch (e) {
    logger.error(e, { task: 'parse auth' });
    process.exit(1);
  }
}

const application = new Application();
application.attach(context);
application.attach(
  createHttpServerApp(
    {
      iwent:
        IWENT_ENABLED && isIwentAdapter(context.migrationAdapter)
          ? {
              adapter: context.migrationAdapter,
            }
          : undefined,
      relational: RELATIONAL_ENABLED
        ? {
            context,
            enableTransactions: TRANSACTION_ENABLED,
            transactionTimeout: TRANSACTION_TIMEOUT,
          }
        : undefined,
      authorization: authentication,
      cors: true, //TODO make it configurable
    },
    PORT,
  ),
);
