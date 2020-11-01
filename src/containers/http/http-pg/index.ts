import { RuleConfig, run } from '../server';
import { adapter } from '../../../packages/pg-adapter/adapter-implementation';
import { getClient } from '../../../packages/relational/client/get-client';
import { PostgresAdapter } from '../../../packages/pg-adapter/adapter/postgres.adapter';
import { OrmRuleContext } from '../../../packages/orm/context/orm-migration-context';

const client = getClient(adapter);
const postgresAdapter = client.dataAdapter as PostgresAdapter;
const ruleContext = new RuleConfig(new OrmRuleContext(client));

postgresAdapter.addNotificationListener('daita_migrations', () => {
  console.log('reload rules');
  ruleContext.reload();
});

run(client, ruleContext).catch((err) => {
  console.error(err);
  process.exit(1);
});
