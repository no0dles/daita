import { RelationalTransactionAdapter } from '../relational/adapter';
import { PostgresAdapter } from './adapter/postgres.adapter';
import { Pool } from 'pg';
import { dropDatabase, ensureDatabaseExists } from './postgres.util';
import { failNever, isKind } from '../common/utils';
import { RelationalAdapterImplementation } from '../relational/adapter/relational-adapter-implementation';
import { PostgresSql } from './sql/postgres-sql';

export interface PostgresAdapterBaseOptions {
  listenForNotifications?: boolean;
}

export interface PostgresAdapterConnectionStringOptions {
  connectionString: string;
}

const isConnectionStringOptions = (val: any): val is PostgresAdapterConnectionStringOptions =>
  isKind<PostgresAdapterConnectionStringOptions>(val, ['connectionString']);

export interface PostgresAdapterConnectionStringDropOptions extends PostgresAdapterConnectionStringOptions {
  dropIfExists: boolean;
}

const isConnectionStringDropOptions = (val: any): val is PostgresAdapterConnectionStringDropOptions =>
  isKind<PostgresAdapterConnectionStringDropOptions>(val, ['connectionString', 'dropIfExists']);

export interface PostgresAdapterConnectionStringCreateOptions extends PostgresAdapterConnectionStringOptions {
  createIfNotExists: boolean;
}

const isConnectionStringCreateOptions = (val: any): val is PostgresAdapterConnectionStringCreateOptions =>
  isKind<PostgresAdapterConnectionStringCreateOptions>(val, ['connectionString', 'createIfNotExists']);

export interface PostgresAdapterHostOptions {
  host: string;
  port?: number;
  username: string;
  password: string;
  database?: string;
}

const isHostOptions = (val: any): val is PostgresAdapterHostOptions =>
  isKind<PostgresAdapterHostOptions>(val, ['host']);

export interface PostgresAdapterHostWithDatabaseOptions extends PostgresAdapterHostOptions {
  database: string;
}

const isHostWithDatabaseOptions = (val: any): val is PostgresAdapterHostWithDatabaseOptions =>
  isKind<PostgresAdapterHostWithDatabaseOptions>(val, ['host', 'database']);

export interface PostgresAdapterHostWithDatabaseDropOptions extends PostgresAdapterHostWithDatabaseOptions {
  dropIfExists: boolean;
}

const isHostWithDatabaseDropOptions = (val: any): val is PostgresAdapterHostWithDatabaseDropOptions =>
  isKind<PostgresAdapterHostWithDatabaseDropOptions>(val, ['host', 'database', 'dropIfExists']);

export interface PostgresAdapterHostWithDatabaseCreateOptions extends PostgresAdapterHostWithDatabaseOptions {
  createIfNotExists: boolean;
}

const isHostWithDatabaseCreateOptions = (val: any): val is PostgresAdapterHostWithDatabaseCreateOptions =>
  isKind<PostgresAdapterHostWithDatabaseCreateOptions>(val, ['host', 'database', 'createIfNotExists']);

export type PostgresAdapterOptions = (
  | PostgresAdapterConnectionStringOptions
  | PostgresAdapterConnectionStringDropOptions
  | PostgresAdapterConnectionStringCreateOptions
  | PostgresAdapterHostOptions
  | PostgresAdapterHostWithDatabaseCreateOptions
  | PostgresAdapterHostWithDatabaseDropOptions
) &
  PostgresAdapterBaseOptions;

export const postgresAdapter: RelationalAdapterImplementation<PostgresSql, PostgresAdapterOptions> = {
  getAdapter(options?: PostgresAdapterOptions): RelationalTransactionAdapter<any> {
    return new PostgresAdapter(
      new Promise((resolve, reject) => {
        prepareDatabase(options)
          .then((connectionString) => {
            resolve(
              new Pool({
                connectionString: connectionString,
                connectionTimeoutMillis: 10000,
                keepAlive: true,
                max: 20,
                idleTimeoutMillis: 10000,
              }),
            );
          })
          .catch((err) => {
            reject(err);
          });
      }),
      { listenForNotifications: options?.listenForNotifications ?? false },
    );
  },
};

async function prepareDatabase(options?: PostgresAdapterOptions) {
  if (!options) {
    return process.env.DATABASE_URL;
  } else if (isConnectionStringCreateOptions(options)) {
    if (options.createIfNotExists) {
      await ensureDatabaseExists(options.connectionString);
    }
    return options.connectionString;
  } else if (isConnectionStringDropOptions(options)) {
    if (options.dropIfExists) {
      await dropDatabase(options.connectionString);
      await ensureDatabaseExists(options.connectionString);
    }
    return options.connectionString;
  } else if (isConnectionStringOptions(options)) {
    return options.connectionString;
  } else if (isHostWithDatabaseCreateOptions(options)) {
    const connectionString = getConnectionString(options);
    if (options.createIfNotExists) {
      await ensureDatabaseExists(connectionString);
    }
    return connectionString;
  } else if (isHostWithDatabaseDropOptions(options)) {
    const connectionString = getConnectionString(options);
    if (options.dropIfExists) {
      await dropDatabase(connectionString);
      await ensureDatabaseExists(connectionString);
    }
    return connectionString;
  } else if (isHostWithDatabaseOptions(options)) {
    return getConnectionString(options);
  } else if (isHostOptions(options)) {
    return getConnectionString(options);
  } else {
    failNever(options, 'unknown postgres adapter options');
  }
}

function getConnectionString(options: PostgresAdapterHostOptions | PostgresAdapterHostWithDatabaseOptions) {
  return `postgres://${options.username || ''}${options.password ? ':' : ''}${options.password || ''}@${options.host}${
    options.port !== null && options.port !== undefined ? `:${options.port}` : ''
  }${options.database ? `/${options.database}` : ''}`;
}
