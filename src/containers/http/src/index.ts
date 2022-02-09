import fs from 'fs';
import {
  createLogger,
  getBoolEnvironmentVariable,
  getEnvironmentVariable,
  getNumberEnvironmentVariable,
} from '@daita/common';
import { createHttpServerApp, HttpServerAuthorization } from '@daita/http-server';
import { Application, getServer } from '@daita/node';
import { adapter as sqliteAdapter } from '@daita/sqlite-adapter';
import { adapter as pgAdapter } from '@daita/pg-adapter';

const DATABASE_URL = getEnvironmentVariable('DATABASE_URL', './http.db');
const AUTH_FILE = getEnvironmentVariable('AUTH_FILE', 'auth.json');
const SCHEMA_NAME = getEnvironmentVariable('SCHEMA_NAME', 'default');
const IWENT_ENABLED = getBoolEnvironmentVariable('IWENT_ENABLED', true);
const RELATIONAL_ENABLED = getBoolEnvironmentVariable('RELATIONAL_ENABLED', true);
const PORT = getNumberEnvironmentVariable('PORT', 3000);

const logger = createLogger({ container: 'http' });
logger.info(`AUTH_FILE=${AUTH_FILE}`);
logger.info(`PORT=${PORT}`);
logger.debug(`DATABASE_URL=${DATABASE_URL}`); // TODO redact pw, use logger

const adapter = DATABASE_URL.startsWith('postgres')
  ? pgAdapter.getRelationalAdapter({
      connectionString: DATABASE_URL,
      createIfNotExists: true,
    })
  : sqliteAdapter.getRelationalAdapter({
      file: DATABASE_URL,
    });

const authentication: HttpServerAuthorization = { providers: [], rules: { schemaName: SCHEMA_NAME } };
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

const app = createHttpServerApp({
  relational: RELATIONAL_ENABLED
    ? {
        dataAdapter: adapter,
      }
    : undefined,
  authorization: authentication,
  cors: true, //TODO make it configurable
});

const application = new Application();
application.attach(adapter);
application.attach(
  getServer(app, PORT).then((res) => {
    logger.info(`listening on ${res.address}`);
    return res.server;
  }),
);
