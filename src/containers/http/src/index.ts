import fs from 'fs';
import {
  createLogger,
  getBoolEnvironmentVariable,
  getEnvironmentVariable,
  getNumberEnvironmentVariable,
} from '@daita/common';
import { getContext, RelationalMigrationAdapterImplementation } from '@daita/orm';
import { createHttpServerApp, HttpServerAuthorization } from '@daita/http-server';
import { Application } from '@daita/node';
import { adapter as sqliteAdapter } from '@daita/sqlite-adapter';
import { adapter as pgAdapter } from '@daita/pg-adapter';

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
