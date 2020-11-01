import { RuleConfig, run } from '../server';
import { sqliteAdapter } from '../../../packages/sqlite-adapter/sqlite-adapter-implementation';
import { getClient } from '../../../packages/relational/client/get-client';
import { OrmRuleContext } from '../../../packages/orm/context/orm-migration-context';

const client = getClient(sqliteAdapter);
const ruleContext = new RuleConfig(new OrmRuleContext(client));

run(client, ruleContext).catch((err) => {
  console.error(err);
  process.exit(1);
});
