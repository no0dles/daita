import { getMigrationContext } from '../../packages/orm/context';
import * as schema from '../../packages/auth/schema';
import { app } from '../../packages/auth/app';
import { adminApp } from '../../packages/auth/admin-app';
import * as pg from '../../packages/pg-adapter';
import { getClient } from '../../packages/relational/client';
import { seedAuthDefaults } from './client';

const adapter = new pg.PostgresAdapter(
  process.env.DATABASE_URL ||
    'postgres://postgres:postgres@localhost:5432/auth',
);
const client = getClient(adapter);
const context = getMigrationContext(client, schema);

context
  .update()
  .then(() => {
    console.log('migrated');
  })
  .catch((err) => {
    console.log(err, 'failed');
  });

seedAuthDefaults(client).catch((err) => {
  console.log(err, 'failed');
});

app.adapter = adapter;
app.client = client;
adminApp.adapter = adapter;
adminApp.client = client;

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
  if (adapter) {
    adapter.close();
  }
  if (appServer) {
    appServer.close();
  }
  if (adminServer) {
    adminServer.close();
  }
});
