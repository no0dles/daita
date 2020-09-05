import { postgresAdapter } from './adapter-implementation';

export { PostgresAdapter } from './adapter/postgres.adapter';
export { PostgresDataAdapter } from './adapter/postgres-data-adapter';
export { postgresAdapter } from './adapter-implementation';

export const adapter = postgresAdapter;
