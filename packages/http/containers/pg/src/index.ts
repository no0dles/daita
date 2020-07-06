import { createHttpServer } from '@daita/http-server';
import * as pg from '@daita/pg-adapter';
import { now } from '@daita/relational';

const DATABASE_URL = process.env.DATABASE_URL;
const TRANSACTION_TIMEOUT = process.env.TRANSACTION_TIMEOUT ? parseInt(process.env.TRANSACTION_TIMEOUT) : 4000;
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

console.log(DATABASE_URL);
console.log(TRANSACTION_TIMEOUT);
console.log(PORT);

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });

setTimeout(() => {
  debugger;

  pg.adapterFactory.createTransactionAdapter({
    connectionString: DATABASE_URL
  }).then(async pgAdapter => {
    console.log('run query');
    await pgAdapter.exec({
      select: now(),
    });
    const server = createHttpServer({
      transactionTimeout: TRANSACTION_TIMEOUT,
      dataAdapter: pgAdapter,
    });
    server.listen(PORT, () => console.log(`listening ${PORT}`));
  }).catch(e => {
    console.log('test')
    console.error(e);
  }).then(() => {
    console.log('done');
  });
}, 10000);
