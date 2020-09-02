import { run } from '../server';
import { postgresAdapter } from '../../../packages/pg-adapter/adapter-implementation';
import { getClient } from '../../../packages/relational/client';

const client = getClient(postgresAdapter);
run(client).catch((err) => {
  console.error(err);
  process.exit(1);
});
