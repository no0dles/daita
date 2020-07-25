import { getMigrationContext } from '@daita/orm';
import * as schema from './schema';
import * as app from './app';
import * as adminApp from './admin-app';
import { client } from './client';

const context = getMigrationContext(client, schema);

context.update().then(() => {
  console.log('migrated');
}).catch(err => {
  console.log(err, 'failed');
});

app.listen(4000, () => console.log(`running web at :4000`));
adminApp.listen(5000, () => console.log('running admin web at :5000'));

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });
