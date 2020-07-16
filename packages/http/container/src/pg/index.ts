import * as pg from '@daita/pg-adapter';
import { run } from '../server';

run(pg.adapterFactory).catch(err => {
  console.error(err);
  process.exit(1);
});
