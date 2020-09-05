import { getClientFromConfig } from '../utils/data-adapter';
import { getSchemaInformation, getSchemaLocation } from '../utils/path';
import { AstContext } from '../ast/ast-context';
import { getAuthorization } from '../utils/authorization';
import { createHttpServerApp } from '../../http-server';
import { anonymous, anything } from '../../relational/permission/function';
import { Rule } from '../../relational/permission/description';
import { OrmRuleContext } from '../../orm/context';
import {
  authSchema,
  createAuthApp,
  seedUserPool,
  seedUserPoolCors,
} from '../../auth';
import { migrate } from '../../orm/migration';

export async function serve(opts: {
  cwd?: string;
  schema?: string;
  port?: number;
  authPort?: number;
  disableAuth?: boolean;
}) {
  const client = await getClientFromConfig(opts);
  if (!client) {
    throw new Error('no relational adapter');
  }

  const ruleContext = new OrmRuleContext(client);
  const rules: Rule[] = await ruleContext.getRules();
  const authorization = getAuthorization(opts);

  if (opts.disableAuth) {
    rules.push({ auth: anonymous(), type: 'allow', sql: anything() });
  } else {
    const schemaLocation = await getSchemaLocation(opts);
    const astContext = new AstContext();
    const schemaInfo = await getSchemaInformation(astContext, schemaLocation);
    if (!schemaInfo) {
      console.warn('could not load schema');
      return;
    }

    const migrationTree = schemaInfo.getMigrationTree();
    const currentSchema = migrationTree.getSchemaDescription({
      backwardCompatible: false,
    });
    rules.push(...currentSchema.rules.map((r) => r.rule));
  }

  const httpApp = createHttpServerApp(client, {
    authorization,
    rules,
    cors: true,
  });

  let authServer: any;
  if (!opts.disableAuth) {
    await migrate(client, authSchema);
    await seedUserPool(client, {
      id: 'cli',
      name: 'cli',
      accessTokenExpiresIn: 600,
      algorithm: 'RS256',
      allowRegistration: true,
      checkPasswordForBreach: false,
      emailVerifyExpiresIn: 3600,
      refreshRefreshExpiresIn: 3600,
    });
    await seedUserPoolCors(client, {
      id: 'cli-cors-2',
      url: 'http://localhost:8080',
      userPoolId: 'cli',
    });
    await seedUserPoolCors(client, {
      id: 'cli-cors-1',
      url: 'http://localhost:4200',
      userPoolId: 'cli',
    });
    const authApp = createAuthApp(client);
    const authPort = opts.authPort || 8766;

    authServer = authApp.listen(authPort, () => {
      console.log(`auth api listening on http://localhost:${authPort}`);
    });
  }

  const httpPort = opts.port || 8765;
  const server = httpApp.listen(httpPort, () => {
    console.log(`api listening on http://localhost:${httpPort}`);
  });

  process.on('SIGINT', () => {
    console.log('stopping http server');
    server?.close();
    client?.close();
    authServer?.close();
  });
}
