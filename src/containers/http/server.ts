import * as fs from 'fs';
import { AppAuthorization } from '../../packages/http-server-common/app-authorization';
import { createHttpServerApp } from '../../packages/http-server/app';
import { Application } from '../../packages/node/application';
import { createLogger } from '../../packages/common/utils/logger';
import { MigrationContext } from '../../packages/orm/context/get-migration-context';

const logger = createLogger({ container: 'http' });
const TRANSACTION_TIMEOUT = process.env.TRANSACTION_TIMEOUT ? parseInt(process.env.TRANSACTION_TIMEOUT) : 4000;
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const AUTH_FILE = process.env.AUTH_FILE || 'auth.json';

logger.info(`TRANSACTION_TIMEOUT=${TRANSACTION_TIMEOUT}`);

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
    logger.error(e, { task: 'parse auth' });
    process.exit(1);
  }
}

export function run(context: MigrationContext<any>) {
  const application = new Application();
  application.attach(context);
  application.attach(
    createHttpServerApp(
      {
        context,
        transactionTimeout: TRANSACTION_TIMEOUT,
        enableTransactions: true, // TODO make it configurable
        authorization: authentication,
        cors: true, //TODO make it configurable
      },
      PORT,
    ),
  );
}
