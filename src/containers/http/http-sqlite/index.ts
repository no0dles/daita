import { RuleConfig, run } from '../server';
import { sqliteAdapter } from '../../../packages/sqlite-adapter/sqlite-adapter-implementation';
import { getClient } from '../../../packages/relational/client/get-client';

const client = getClient(sqliteAdapter);
const ruleContext = new RuleConfig();

run(client, ruleContext).catch((err) => {
  console.error(err);
  process.exit(1);
});
