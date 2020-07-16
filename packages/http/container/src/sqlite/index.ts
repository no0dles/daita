import * as sqlite from '@daita/sqlite-adapter';
import { run } from '../server';

run(sqlite.adapterFactory).catch(err => {
  console.error(err);
  process.exit(1);
});
