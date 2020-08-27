import * as path from 'path';
import { getRelationalDataAdapter } from '../utils/data-adapter';
import { createHttpServer } from '@daita/http-server';
import { anything, anonymous, Rule, getClient } from '@daita/relational';
import { getSchemaInformation, getSchemaLocation } from '../utils/path';
import { AstContext } from '../ast/ast-context';
import { getAuthorization } from '../utils/authorization';
import { OrmRuleContext } from '@daita/orm';

export async function serve(opts: { cwd?: string, schema?: string, port?: number, disableAuth?: boolean }) {
  process.env.SUPPRESS_NO_CONFIG_WARNING = 'true';
  if (opts.cwd) {
    process.env.NODE_CONFIG_DIR = path.join(opts.cwd, 'config');
  }

  const dataAdapter = await getRelationalDataAdapter(opts);
  if (!dataAdapter) {
    throw new Error('no relational adapter');
  }

  const ruleContext = new OrmRuleContext(getClient(dataAdapter));
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
    const currentSchema = migrationTree.getSchemaDescription({ backwardCompatible: false });
    rules.push(...currentSchema.rules.map(r => r.rule));
  }

  const app = createHttpServer({
    dataAdapter,
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
    dataAdapter?.close();
  });
}
