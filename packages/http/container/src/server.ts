import { parsing, RelationalTransactionAdapterFactory, Rule } from '@daita/relational';
import * as fs from 'fs';
import { createHttpServer } from '@daita/http-server';
import { AppAuthorization } from '@daita/http-server-common';

const DATABASE_URL = process.env.DATABASE_URL;
const TRANSACTION_TIMEOUT = process.env.TRANSACTION_TIMEOUT ? parseInt(process.env.TRANSACTION_TIMEOUT) : 4000;
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const RULE_FILE = process.env.RULE_FILE || 'rules.json';
const AUTH_FILE = process.env.AUTH_FILE || 'auth.json';

console.log(`DATABASE_URL=${DATABASE_URL}`);
console.log(`TRANSACTION_TIMEOUT=${TRANSACTION_TIMEOUT}`);
console.log(`PORT=${PORT}`);

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

const authentication: AppAuthorization = { providers: [], tokens: [] };
if (fs.existsSync(AUTH_FILE)) {
  const content = fs.readFileSync(AUTH_FILE, { encoding: 'utf8' });
  try {
    const parsedAuthentication = JSON.parse(content);
    authentication.tokens = parsedAuthentication && parsedAuthentication.tokens ? parsedAuthentication.tokens : [];
    authentication.providers = parsedAuthentication && parsedAuthentication.providers ? parsedAuthentication.providers : [];
  } catch (e) {
    console.error('error parsing auth');
    console.error(e);
    process.exit(1);
  }
}

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });


export async function run(factory: RelationalTransactionAdapterFactory) {
  const adapter = await factory.createTransactionAdapter({
    connectionString: DATABASE_URL,
  });
  const app = createHttpServer({
    transactionTimeout: TRANSACTION_TIMEOUT,
    dataAdapter: adapter,
    authorization: authentication,
    rules,
  });

  const server = app.listen(PORT, async () => {
    console.log(`listening ${PORT}`);
  });

  process.on('SIGTERM', () => {
    if(adapter) {
      adapter.close();
    }
    if (server) {
      server.close();
    }
  });
}
