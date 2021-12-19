import { createLogger, getEnvironmentVariable, getNumberEnvironmentVariable } from '@daita/common';
import { getContext, RelationalMigrationAdapterImplementation } from '@daita/orm';
import { Application } from '@daita/node';
import { IwentApplication, IwentPollProcessor } from '@daita/iwent';
import { adapter as sqliteAdapter } from '@daita/sqlite-adapter';
import { adapter as pgAdapter } from '@daita/pg-adapter';

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

  console.log('process app');
  const processor = new IwentPollProcessor(app);

  application.attach(context);
  application.attach(processor.run(context));
} catch (e) {
  logger.error(e);
  process.exit(1);
}
