import { RuleConfig, run } from '../server';
import { adapter } from '../../../packages/pg-adapter/adapter';
import { getClient } from '../../../packages/relational/client/get-client';
import { PostgresAdapter } from '../../../packages/pg-adapter/adapter/postgres.adapter';

const client = getClient(adapter);
const migrationAdapter = adapter.getMigrationAdapter();
const postgresAdapter = client.dataAdapter as PostgresAdapter;
const ruleContext = new RuleConfig(migrationAdapter);

postgresAdapter.addNotificationListener('daita_migrations', () => {
  console.log('reload rules');
  ruleContext.reload();
});

run(client, ruleContext).catch((err) => {
  console.error(err);
  process.exit(1);
});
