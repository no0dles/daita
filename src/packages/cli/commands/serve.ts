import * as path from 'path';
import { getClientFromConfig } from '../utils/data-adapter';
import { getSchemaInformation, getSchemaLocation } from '../utils/path';
import { AstContext } from '../ast/ast-context';
import { getAuthorization } from '../utils/authorization';
import { createHttpServerApp } from '../../http-server';
import { anonymous, anything } from '../../relational/permission/function';
import { Rule } from '../../relational/permission/description';
import { OrmRuleContext } from '../../orm/context';

export async function serve(opts: {
  cwd?: string;
  schema?: string;
  port?: number;
  disableAuth?: boolean;
}) {
  process.env.SUPPRESS_NO_CONFIG_WARNING = 'true';
  if (opts.cwd) {
    process.env.NODE_CONFIG_DIR = path.join(opts.cwd, 'config');
  }

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

  const app = createHttpServerApp(client, {
    authorization,
    rules,
    cors: true,
  });

  const port = opts.port || 8765;
  const server = app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
  });

  process.on('SIGINT', () => {
    console.log('stopping http server');
    server?.close();
    client?.close();
  });
}
