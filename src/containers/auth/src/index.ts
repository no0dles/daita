import { createAuthApp } from '@daita/auth-server';
import { createAuthAdminApp } from '@daita/auth-server';
import { seedAuthDefaults } from './client';
import { adapter as sqliteAdapter } from '@daita/sqlite-adapter';
import { adapter as mariadbAdapter } from '@daita/mariadb-adapter';
import { adapter as pgAdapter } from '@daita/pg-adapter';
import { authSchema } from '@daita/auth-server';
import { Application } from '@daita/node';
import { createLogger } from '@daita/common';
import { getContext } from '@daita/orm';
import { RelationalMigrationAdapterImplementation } from '@daita/orm';
import { createMetricsApp } from '@daita/auth-server';

const logger = createLogger({ container: 'auth' });
const application = new Application();

const dbUrl = process.env.DATABASE_URL || './auth.db';
const adapter: RelationalMigrationAdapterImplementation<any, any> = dbUrl.startsWith('postgres')
  ? pgAdapter
  : dbUrl.startsWith('mariadb')
  ? mariadbAdapter
  : sqliteAdapter;
logger.info(`use ${adapter} adapter with connectionString ${dbUrl}`); // TODO redact pw

const ctx = getContext(adapter, {
  schema: authSchema,
  connectionString: dbUrl,
});

application.attach(ctx);

ctx
  .migrate()
  .then(async () => {
    logger.info('migrated schema');
    await seedAuthDefaults(ctx);
  })
  .catch((err) => {
    application.close(err);
  });

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
const ADMIN_PORT = process.env.ADMIN_PORT ? parseInt(process.env.ADMIN_PORT) : 5000;
const METRICS_PORT = process.env.METRICS_PORT ? parseInt(process.env.METRICS_PORT) : 9000;

application.attach(createMetricsApp(METRICS_PORT));
application.attach(createAuthApp(ctx, PORT));
application.attach(createAuthAdminApp(ctx, ADMIN_PORT));
