import { run } from '../server';
import { adapter } from '../../../packages/pg-adapter/adapter/adapter';
import { getContext } from '../../../packages/orm/context/get-context';

run(
  getContext(adapter, {
    connectionString: process.env.DATABASE_URL!,
  }),
);
