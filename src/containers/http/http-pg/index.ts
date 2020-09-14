import { run } from '../server';
import { postgresAdapter } from '../../../packages/pg-adapter/adapter-implementation';
import { getClient } from '../../../packages/relational/client';
import { OrmRuleContext } from '../../../packages/orm/context';
import { Rule } from '../../../packages/relational/permission/description';
import { PostgresAdapter } from '../../../packages/pg-adapter';

const client = getClient(postgresAdapter);
const adapter = client.dataAdapter as PostgresAdapter;
const ruleContext = new OrmRuleContext(client);
const rules: Rule[] = [];

adapter.addNotificationListener('daita_migrations', () => {
  console.log('reload rules');
  reloadRules();
});

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
