import { PostgresAdapter } from './adapter/postgres.adapter';
import { parse } from 'pg-connection-string';
import { dropDatabase, ensureDatabaseExists } from './postgres.util';
import { Pool } from 'pg';
import {
  CreateAdapterOptions,
  CreateDataAdapterOptions,
  CreateTransactionAdapterOptions,
  DestroyAdapterOptions,
  RelationalDataAdapterFactory,
  RelationalTransactionAdapterFactory,
} from '../relational/adapter/factory';

export { PostgresAdapter } from './adapter/postgres.adapter';
export { dropDatabase, ensureDatabaseExists } from './postgres.util';

export const adapterFactory: RelationalDataAdapterFactory & RelationalTransactionAdapterFactory = {
  async createTransactionAdapter(options?: CreateTransactionAdapterOptions): Promise<PostgresAdapter> {
    return getPostgresAdapter(options);
  },
  async createDataAdapter(options?: CreateDataAdapterOptions): Promise<PostgresAdapter> {
    return getPostgresAdapter(options);
  },
  async destroy(options?: DestroyAdapterOptions): Promise<void> {

  },
  name: '@daita/pg-adapter',
  canCreate(connectionString: string): boolean {
    return connectionString.startsWith('postgres:');
  },
};

export function getPostgresAdapter(options?: CreateAdapterOptions): PostgresAdapter {
  const connectionString = options?.connectionString ?? process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('missing connection string');
  }

  return new PostgresAdapter(new Promise((resolve, reject) => {
    prepareDatabase(connectionString, options).then(() => {
      resolve(new Pool({
        connectionString: connectionString,
        connectionTimeoutMillis: 10000,
        keepAlive: true,
        max: 20,
        idleTimeoutMillis: 10000,
      }));
    }).catch(err => {
      reject(err);
    });
  }));
}

async function prepareDatabase(connectionString: string, options?: CreateAdapterOptions) {
  const config = parse(connectionString);
  if (options?.database) {
    config.database = options.database;
  }
  if (options?.dropIfExists) {
    await dropDatabase(config);
  }
  if (options?.createIfNotExists) {
    await ensureDatabaseExists(config);
  }
}
