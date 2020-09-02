import { createAuthApp } from '../../packages/auth/app';
import { createAuthAdminApp } from '../../packages/auth/admin-app';
import { getClient } from '../../packages/relational/client';
import { seedAuthDefaults } from './client';
import { postgresAdapter } from '../../packages/pg-adapter/adapter-implementation';
import { migrate } from '../../packages/orm/migration/migrate';
import { authSchema } from '../../packages/auth/schema';

const client = getClient(postgresAdapter, {
  connectionString:
    process.env.DATABASE_URL ||
    'postgres://postgres:postgres@localhost:5432/auth',
});

migrate(client, authSchema)
  .then(() => {
    console.log('migrated');
  })
  .catch((err) => {
    console.log(err, 'failed');
  });

seedAuthDefaults(client).catch((err) => {
  console.log(err, 'failed');
});

const app = createAuthApp(client);
const adminApp = createAuthAdminApp(client);

const appServer = app.listen(4000, () => console.log(`running web at :4000`));
const adminServer = adminApp.listen(5000, () =>
  console.log('running admin web at :5000'),
);

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', (err) => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });

process.on('SIGTERM', () => {
  if (client) {
    client.close();
  }
  if (appServer) {
    appServer.close();
  }
  if (adminServer) {
    adminServer.close();
  }
});
