import { createAuthApp } from '../../packages/auth/app';
import { createAuthAdminApp } from '../../packages/auth/admin-app';
import { seedAuthDefaults } from './client';
import { adapter } from '../../packages/pg-adapter/adapter';
import { migrate } from '../../packages/orm/migration/migrate';
import { authSchema } from '../../packages/auth/schema';
import { getClient } from '../../packages/relational/client/get-client';

const client = getClient(adapter, {
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/auth',
});

migrate(client, authSchema)
  .then(async () => {
    console.log('migrated');

    await seedAuthDefaults(client);
  })
  .catch((err) => {
    console.log(err, 'failed');
  });

const app = createAuthApp(client);
const adminApp = createAuthAdminApp(client);

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
    if (client) {
      client.close();
    }
    if (appServer) {
      appServer.close();
    }
    if (adminServer) {
      adminServer.close();
    }
  }, 15000);
});
