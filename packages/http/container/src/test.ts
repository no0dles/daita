import { Pool } from 'pg';

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://user:pass@database/db',
  min: 10,
  application_name: 'daita',
  log: mess => console.log(mess),
  //port: 5432,
  //password: 'test',
  //user: 'foo',
  connectionTimeoutMillis: 10000,
  keepAlive: true,
});
console.log('pool', process.env.DATABASE_URL);
pool.on('connect', console.log);
pool.on('acquire', console.log);
pool.on('error', console.log);
pool.on('remove', console.log);
pool.connect().then(client => {
  console.log('client');
  client.query('SELECT now()').then(res => {
    console.log('res', res);
  }).catch(console.log);
}).catch(console.log);
