import { run } from '../server';
import { sqliteAdapter } from '../../../packages/sqlite-adapter/sqlite-adapter-implementation';
import { getClient } from '../../../packages/relational/client';

const client = getClient(sqliteAdapter);
run(client).catch((err) => {
  console.error(err);
  process.exit(1);
});
