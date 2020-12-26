import { createAuthApp } from '../../packages/auth-server/app';
import { createAuthAdminApp } from '../../packages/auth-server/admin-app';
import { seedAuthDefaults } from './client';
import { adapter as sqliteAdapter } from '../../packages/sqlite-adapter';
import { adapter as mariadbAdapter } from '../../packages/mariadb-adapter';
import { adapter as pgAdapter } from '../../packages/pg-adapter/adapter/adapter';
import { authSchema } from '../../packages/auth-server/schema';
import { Application } from '../../packages/node/application';
import { createLogger } from '../../packages/common/utils/logger';
import { getContext } from '../../packages/orm/context/get-context';
import { RelationalMigrationAdapterImplementation } from '../../packages/orm/adapter/relational-migration-adapter-implementation';
import { createMetricsApp } from '../../packages/auth-server/metrics-app';

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
