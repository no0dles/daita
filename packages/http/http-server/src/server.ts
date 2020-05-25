import { createHttpServer } from './app';
import * as pg from '@daita/pg-adapter';

pg.adapterFactory.createTransactionAdapter({
  connectionString: 'postgres://postgres:postgres@localhost/postgres'
}).then(pgAdapter => {
  const server = createHttpServer({
    transactionTimeout: 4000,
    dataAdapter: pgAdapter,
  });
  server.listen(3000, () => console.log('listening'));
});

