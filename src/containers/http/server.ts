import * as fs from 'fs';
import { AppAuthorization } from '../../packages/http-server-common';
import { createHttpServerApp } from '../../packages/http-server';
import { TransactionClient } from '../../packages/relational/client';
import { OrmRuleContext } from '../../packages/orm/context';
import { Rule } from '../../packages/relational/permission/description';

const TRANSACTION_TIMEOUT = process.env.TRANSACTION_TIMEOUT
  ? parseInt(process.env.TRANSACTION_TIMEOUT)
  : 4000;
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const AUTH_FILE = process.env.AUTH_FILE || 'auth.json';

console.log(`TRANSACTION_TIMEOUT=${TRANSACTION_TIMEOUT}`);
console.log(`PORT=${PORT}`);

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
  const ruleContext = new OrmRuleContext(client);
  const rules: Rule[] = await ruleContext.getRules(); //TODO reload

  const app = createHttpServerApp(client, {
    transactionTimeout: TRANSACTION_TIMEOUT,
    authorization: authentication,
    rules,
    cors: true, //TODO make it configurable
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
