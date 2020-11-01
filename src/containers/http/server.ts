import * as fs from 'fs';
import { AppAuthorization } from '../../packages/http-server-common/app-authorization';
import { createHttpServerApp } from '../../packages/http-server/app';
import { TransactionClient } from '../../packages/relational/client/transaction-client';
import { OrmRuleContext } from '../../packages/orm/context/orm-migration-context';
import { Rule } from '../../packages/relational/permission/description/rule';

const TRANSACTION_TIMEOUT = process.env.TRANSACTION_TIMEOUT ? parseInt(process.env.TRANSACTION_TIMEOUT) : 4000;
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const AUTH_FILE = process.env.AUTH_FILE || 'auth.json';
const RULES_FILE = process.env.RULES_FILE || 'rules.json';

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

export class RuleConfig {
  private readonly baseRulesCount: number = 0;

  rules: Rule[] = [];

  constructor(private ruleContext: OrmRuleContext) {
    if (fs.existsSync(RULES_FILE)) {
      const content = fs.readFileSync(RULES_FILE, { encoding: 'utf8' });
      try {
        const parsedRules = JSON.parse(content);
        this.rules.push(...parsedRules);
        this.baseRulesCount = parsedRules.length;
      } catch (e) {
        console.error('error parsing rules');
        console.error(e);
        process.exit(1);
      }
    }
    this.reload();
  }

  async reload() {
    const dbRules = await this.ruleContext.getRules();
    if (this.rules.length > this.baseRulesCount) {
      this.rules.splice(this.baseRulesCount, this.rules.length - this.baseRulesCount);
    }
    this.rules.push(...dbRules);
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

export async function run(client: TransactionClient<any>, ruleConfig: RuleConfig) {
  console.log(authentication);

  const app = createHttpServerApp(client, {
    transactionTimeout: TRANSACTION_TIMEOUT,
    authorization: authentication,
    rules: ruleConfig.rules,
    cors: true, //TODO make it configurable
  });

  const server = app.listen(PORT, async () => {
    console.log(`listening ${PORT}`);
  });

  process.on('SIGTERM', () => {
    setTimeout(() => {
      if (client) {
        client.close();
      }
      if (server) {
        server.close();
      }
    }, 15000);
  });
}
