import { createHttpServer } from '@daita/http-server';
import * as sqlite from '@daita/sqlite-adapter';
import * as fs from 'fs';
import { now, parsing, Rule } from '@daita/relational';

const DATABASE_URL = process.env.DATABASE_URL;
const TRANSACTION_TIMEOUT = process.env.TRANSACTION_TIMEOUT ? parseInt(process.env.TRANSACTION_TIMEOUT) : 4000;
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const RULE_FILE = process.env.RULE_FILE || 'rules.json';
const AUTH_FILE = process.env.AUTH_FILE || 'auth.json';

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

const rules: Rule[] = [];
if (fs.existsSync(RULE_FILE)) {
  const content = fs.readFileSync(RULE_FILE, { encoding: 'utf8' });
  try {
    rules.push(...parsing(content));
  } catch (e) {
    console.error('error parsing rules');
    console.error(e);
    process.exit(1);
  }
} else {
  console.log('No rules configured');
}

const authentication: { uri: string, issuer: string }[] = [];
if (fs.existsSync(AUTH_FILE)) {
  const content = fs.readFileSync(AUTH_FILE, { encoding: 'utf8' });
  try {
    authentication.push(...JSON.parse(content));
  } catch (e) {
    console.error('error parsing auth');
    console.error(e);
    process.exit(1);
  }
}

sqlite.adapterFactory.createTransactionAdapter({
  connectionString: DATABASE_URL,
}).then(adapter => {
  const server = createHttpServer({
    transactionTimeout: TRANSACTION_TIMEOUT,
    dataAdapter: adapter,
    authorization: authentication.length > 0 ? {
      providers: authentication,
    } : undefined,
    rules,
  });
  server.listen(PORT, async () => {
    console.log(`listening ${PORT}`);

    console.log('run query');
    try {
      const res = await adapter.exec({
        select: now(),
      });
      console.log(res);
    } catch (e) {
      console.error(e);
    }
  });
}).catch(e => {
  console.error(e);
});
