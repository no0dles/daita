import * as fs from 'fs';
import { AppAuthorization } from '../../packages/http-server-common/app-authorization';
import { createHttpServerApp } from '../../packages/http-server/app';
import { Context } from '../../packages/orm';
import { Application } from '../../packages/node/application';

const TRANSACTION_TIMEOUT = process.env.TRANSACTION_TIMEOUT ? parseInt(process.env.TRANSACTION_TIMEOUT) : 4000;
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const AUTH_FILE = process.env.AUTH_FILE || 'auth.json';

console.log(`TRANSACTION_TIMEOUT=${TRANSACTION_TIMEOUT}`);
console.log(`PORT=${PORT}`);

const authentication: AppAuthorization = { providers: [] };
if (fs.existsSync(AUTH_FILE)) {
  const content = fs.readFileSync(AUTH_FILE, { encoding: 'utf8' });
  try {
    const parsedAuthentication = JSON.parse(content);
    authentication.tokenEndpoints =
      parsedAuthentication && parsedAuthentication.tokenEndpoints ? parsedAuthentication.tokenEndpoints : [];
    authentication.providers =
      parsedAuthentication && parsedAuthentication.providers ? parsedAuthentication.providers : [];
  } catch (e) {
    console.error('error parsing auth');
    console.error(e);
    process.exit(1);
  }
}

export function run(context: Context<any>) {
  const application = new Application();
  application.attach(context);
  application
    .attach(
      createHttpServerApp(
        {
          context,
          transactionTimeout: TRANSACTION_TIMEOUT,
          authorization: authentication,
          cors: true, //TODO make it configurable
        },
        PORT,
      ),
    )
    .then(() => {
      console.log(`listening ${PORT}`);
    });
}
