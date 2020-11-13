import { createAuthApp } from '../../../packages/auth-server/app';
import { createAuthAdminApp } from '../../../packages/auth-server/admin-app';
import { seedAuthDefaults } from './client';
import { adapter } from '../../../packages/pg-adapter/adapter/adapter';
import { authSchema } from '../../../packages/auth-server/schema';
import { getContext } from '../../../packages/orm';

const ctx = getContext(adapter, {
  schema: authSchema,
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/auth',
});
ctx
  .migrate()
  .then(async () => {
    console.log('migrated');

    await seedAuthDefaults(ctx);
  })
  .catch((err) => {
    console.log(err, 'failed');
  });

const app = createAuthApp(ctx);
const adminApp = createAuthAdminApp(ctx);

const appServer = app.listen(4000, () => console.log(`running web at :4000`));
const adminServer = adminApp.listen(5000, () => console.log('running admin web at :5000'));

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', (err) => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });

process.on('SIGTERM', () => {
  setTimeout(() => {
    if (ctx) {
      ctx.close();
    }
    if (appServer) {
      appServer.close();
    }
    if (adminServer) {
      adminServer.close();
    }
  }, 15000);
});
