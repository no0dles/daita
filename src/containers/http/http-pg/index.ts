import { RuleConfig, run } from '../server';
import { postgresAdapter } from '../../../packages/pg-adapter/adapter-implementation';
import { getClient } from '../../../packages/relational/client';
import { OrmRuleContext } from '../../../packages/orm/context';
import { PostgresAdapter } from '../../../packages/pg-adapter';

const client = getClient(postgresAdapter);
const adapter = client.dataAdapter as PostgresAdapter;
const ruleContext = new RuleConfig(new OrmRuleContext(client));

adapter.addNotificationListener('daita_migrations', () => {
  console.log('reload rules');
  ruleContext.reload();
});

run(client, ruleContext).catch((err) => {
  console.error(err);
  process.exit(1);
});
