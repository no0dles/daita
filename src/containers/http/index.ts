import { run } from './server';
import { adapter as pgAdapter } from '../../packages/pg-adapter/adapter/adapter';
import { adapter as sqliteAdapter } from '../../packages/sqlite-adapter';
import { getContext } from '../../packages/orm/context/get-context';
import { RelationalMigrationAdapterImplementation } from '../../packages/orm/adapter/relational-migration-adapter-implementation';

const dbUrl = process.env.DATABASE_URL || './auth.db';
const adapter: RelationalMigrationAdapterImplementation<any, any> = dbUrl.startsWith('postgres')
  ? pgAdapter
  : sqliteAdapter;
run(
  getContext(adapter, {
    connectionString: process.env.DATABASE_URL!,
  }),
);
