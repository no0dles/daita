import { run } from '../server';
import { adapterFactory } from '../../../packages/sqlite-adapter';

run(adapterFactory).catch((err) => {
  console.error(err);
  process.exit(1);
});
