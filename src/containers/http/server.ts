import * as fs from 'fs';
import { parseRules, Rule } from '../../packages/relational/permission';
import { AppAuthorization } from '../../packages/http-server-common';
import { createHttpServerApp } from '../../packages/http-server';
import { TransactionClient } from '../../packages/relational/client';

const TRANSACTION_TIMEOUT = process.env.TRANSACTION_TIMEOUT
  ? parseInt(process.env.TRANSACTION_TIMEOUT)
  : 4000;
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const RULE_FILE = process.env.RULE_FILE || 'rules.json';
const AUTH_FILE = process.env.AUTH_FILE || 'auth.json';

console.log(`TRANSACTION_TIMEOUT=${TRANSACTION_TIMEOUT}`);
console.log(`PORT=${PORT}`);

const rules: Rule[] = [];
if (fs.existsSync(RULE_FILE)) {
  const content = fs.readFileSync(RULE_FILE, { encoding: 'utf8' });
  try {
    rules.push(...parseRules(content));
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
    authentication.tokens =
      parsedAuthentication && parsedAuthentication.tokens
        ? parsedAuthentication.tokens
        : [];
    authentication.providers =
      parsedAuthentication && parsedAuthentication.providers
        ? parsedAuthentication.providers
        : [];
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
  .on('uncaughtException', (err) => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });

export async function run(client: TransactionClient<any>) {
  const app = createHttpServerApp(client, {
    transactionTimeout: TRANSACTION_TIMEOUT,
    authorization: authentication,
    rules,
  });

  const server = app.listen(PORT, async () => {
    console.log(`listening ${PORT}`);
  });

  process.on('SIGTERM', () => {
    if (client) {
      client.close();
    }
    if (server) {
      server.close();
    }
  });
}
