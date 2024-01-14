import { dropDatabase, ensureDatabaseExists } from '../postgres.util';
import { PostgresSql } from '../sql/postgres-sql';
import { isKind } from '@daita/common';
import { failNever } from '@daita/common';
import { PostgresMigrationAdapter } from './postgres-migration-adapter';
import { RelationalOrmAdapterImplementation } from '@daita/orm';

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

class PostgresAdapterImplementation implements RelationalOrmAdapterImplementation<PostgresSql, PostgresAdapterOptions> {
  getRelationalAdapter(options: PostgresAdapterOptions): PostgresMigrationAdapter {
    return new PostgresMigrationAdapter({
      connectionString: prepareConnectionString(options),
      listenForNotifications: options.listenForNotifications,
      prepare: () => prepareDatabase(options),
    });
  }
}

export const adapter = new PostgresAdapterImplementation();

function prepareConnectionString(options: PostgresAdapterOptions): string {
  if (
    isConnectionStringCreateOptions(options) ||
    isConnectionStringDropOptions(options) ||
    isConnectionStringOptions(options)
  ) {
    return options.connectionString;
  } else if (
    isHostWithDatabaseCreateOptions(options) ||
    isHostWithDatabaseDropOptions(options) ||
    isHostWithDatabaseOptions(options) ||
    isHostOptions(options)
  ) {
    return getConnectionString(options);
  } else {
    failNever(options, 'unknown postgres adapter options');
  }
}

async function prepareDatabase(options: PostgresAdapterOptions): Promise<void> {
  if (isConnectionStringCreateOptions(options)) {
    if (options.createIfNotExists) {
      await ensureDatabaseExists(options.connectionString);
    }
  } else if (isConnectionStringDropOptions(options)) {
    if (options.dropIfExists) {
      await dropDatabase(options.connectionString);
      await ensureDatabaseExists(options.connectionString);
    }
  } else if (isConnectionStringOptions(options)) {
    return;
  } else if (isHostWithDatabaseCreateOptions(options)) {
    const connectionString = getConnectionString(options);
    if (options.createIfNotExists) {
      await ensureDatabaseExists(connectionString);
    }
  } else if (isHostWithDatabaseDropOptions(options)) {
    const connectionString = getConnectionString(options);
    if (options.dropIfExists) {
      await dropDatabase(connectionString);
      await ensureDatabaseExists(connectionString);
    }
  } else if (isHostWithDatabaseOptions(options)) {
    return;
  } else if (isHostOptions(options)) {
    return;
  } else {
    failNever(options, 'unknown postgres adapter options');
  }
}

function getConnectionString(options: PostgresAdapterHostOptions | PostgresAdapterHostWithDatabaseOptions) {
  return `postgres://${options.username || ''}${options.password ? ':' : ''}${options.password || ''}@${options.host}${
    options.port !== null && options.port !== undefined ? `:${options.port}` : ''
  }${options.database ? `/${options.database}` : ''}`;
}
