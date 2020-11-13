import { run } from '../server';
import { adapter } from '../../../packages/pg-adapter/adapter/adapter';
import { getContext } from '../../../packages/orm';

const ctx = getContext(adapter, {
  connectionString: process.env.DATABASE_URL!,
});
// const postgresAdapter = client.dataAdapter as PostgresMigrationAdapter;
// const ruleContext = new RuleConfig(postgresAdapter);
//
// postgresAdapter.addNotificationListener('daita_migrations', () => {
//   console.log('reload rules');
//   ruleContext.reload();
// });

run(ctx).catch((err) => {
  console.error(err);
  process.exit(1);
});
