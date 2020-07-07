import { createHttpServer } from '@daita/http-server';
import * as sqlite from '@daita/sqlite-adapter';
import { now } from '@daita/relational';
import { SqliteRelationalAdapter } from '@daita/sqlite-adapter';

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

const adapter = new SqliteRelationalAdapter('./test2.db');
adapter.exec({select: now() }).then(data => console.log(data));

// sqlite.adapterFactory.createTransactionAdapter({
//   connectionString: DATABASE_URL
// }).then(adapter => {
//   const server = createHttpServer({
//     transactionTimeout: TRANSACTION_TIMEOUT,
//     dataAdapter: adapter,
//   });
//   server.listen(PORT, async() => {
//     console.log(`listening ${PORT}`)
//
//     console.log('run query');
//     try {
//       const res = await adapter.exec({
//         select: now(),
//       });
//       console.log(res);
//     } catch (e) {
//       console.error(e);
//     }
//   });
// }).catch(e => {
//   console.error(e);
// })
