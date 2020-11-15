import { createAuthApp } from '../../../packages/auth-server/app';
import { createAuthAdminApp } from '../../../packages/auth-server/admin-app';
import { seedAuthDefaults } from './client';
import { adapter } from '../../../packages/pg-adapter/adapter/adapter';
import { authSchema } from '../../../packages/auth-server/schema';
import { getContext } from '../../../packages/orm';
import { Application } from '../../../packages/node/application';
import { createLogger } from '../../../packages/common/utils/logger';

const logger = createLogger({ container: 'auth-pg' });
const application = new Application();

const ctx = getContext(adapter, {
  schema: authSchema,
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/auth',
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

application.attach(createAuthApp(ctx, 4000));

application.attach(createAuthAdminApp(ctx, 5000));
