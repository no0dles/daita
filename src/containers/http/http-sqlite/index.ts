import { run } from '../server';
import { sqliteAdapter } from '../../../packages/sqlite-adapter/adapter/sqlite-adapter-implementation';
import { getContext } from '../../../packages/orm';

const client = getContext(sqliteAdapter, {
  file: process.env.DATABASE_URL!,
});

run(client).catch((err) => {
  console.error(err);
  process.exit(1);
});
