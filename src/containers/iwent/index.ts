import { getEnvironmentVariable, getNumberEnvironmentVariable } from '../../packages/common/utils/environment';
import { RelationalMigrationAdapterImplementation } from '../../packages/orm/adapter/relational-migration-adapter-implementation';
import { adapter as pgAdapter } from '../../packages/pg-adapter';
import { adapter as sqliteAdapter } from '../../packages/sqlite-adapter';
import { Application } from '../../packages/node/application';
import { getContext } from '../../packages/orm';
import { createLogger } from '../../packages/common/utils/logger';
import { IwentPollProcessor } from '../../packages/iwent/iwent-poll-processor';
import { IwentApplication } from '../../packages/iwent/iwent-application';
import { createIwentServer } from '../../packages/iwent-server/server';

const DATABASE_URL = getEnvironmentVariable('DATABASE_URL', './daita.db');
const PORT = getNumberEnvironmentVariable('PORT', 3000);
const SCHEMA_NAME = getEnvironmentVariable('SCHEMA_NAME', 'default');
const APP_PATH = getEnvironmentVariable('APP_PATH');

const logger = createLogger({ container: 'iwent' });

logger.info(`PORT=${PORT}`);
logger.debug(`DATABASE_URL=${DATABASE_URL}`);
logger.debug(`APP_PATH=${APP_PATH}`);

if (!APP_PATH) {
  logger.error('missing APP_PATH variable');
  process.exit(1);
}

const application = new Application();

try {
  console.log('load app');
  const app = require(APP_PATH) as IwentApplication;

  const adapter: RelationalMigrationAdapterImplementation<any, any> = DATABASE_URL.startsWith('postgres')
    ? pgAdapter
    : sqliteAdapter;

  const context = getContext(adapter, {
    connectionString: DATABASE_URL,
    schemaName: SCHEMA_NAME,
  });

  application.attach(context);
  application.attach(
    createIwentServer({
      port: PORT,
      application: app,
      context,
    }),
  );
} catch (e) {
  logger.error(e);
  process.exit(1);
}
