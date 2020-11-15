import { run } from '../server';
import { adapter } from '../../../packages/sqlite-adapter';
import { getContext } from '../../../packages/orm';

run(
  getContext(adapter, {
    file: process.env.DATABASE_URL!,
  }),
);
