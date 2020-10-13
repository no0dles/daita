import { run } from '../server';
import { sqliteAdapter } from '../../../packages/sqlite-adapter/sqlite-adapter-implementation';
import { getClient } from '../../../packages/relational/client';
import { OrmRuleContext } from '../../../packages/orm/context';
import { Rule } from '../../../packages/relational/permission/description';

const client = getClient(sqliteAdapter);
const ruleContext = new OrmRuleContext(client);
const rules: Rule[] = [];

async function reloadRules() {
  const newRules = await ruleContext.getRules();
  rules.splice(0, rules.length);
  rules.push(...newRules);
}

reloadRules();
run(client, rules).catch((err) => {
  console.error(err);
  process.exit(1);
});
