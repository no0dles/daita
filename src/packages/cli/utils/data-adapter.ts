import { getGlobalConfig, getProjectConfig } from './config';
import { HttpAdapterOptions } from '../../http-adapter/adapter-implementation';
import { SqliteAdapterOptions } from '../../sqlite-adapter/sqlite-adapter-implementation';
import { PostgresAdapterOptions } from '../../pg-adapter/adapter';
import { AppAuthorization } from '../../http-server-common/app-authorization';
import { TransactionClient } from '../../relational/client/transaction-client';
import { RelationalAdapterImplementation } from '../../relational/adapter/relational-adapter-implementation';
import { getClient } from '../../relational/client/get-client';
import path from 'path';
import { getMigrationContext, MigrationContext } from '../../orm/context/get-migration-context';
import { MigrationTree } from '../../orm/migration/migration-tree';
import { MigrationAdapterImplementation } from '../../orm/migration/migration-adapter-implementation';
import { MigrationClient } from '../../relational/client/migration-client';
import { RelationalMigrationClient } from '../../relational/client/relational-transaction-client';

export type DaitaContextConfig = DaitaHttpContextConfig | DaitaSqliteContextConfig | DaitaPostgresContextConfig;

export interface BaseContextConfig {
  module?: string;
  connectionString: string; //TODO ts 4.1
  schemaLocation?: string;
  schemaName?: string;
  migrationLocation?: string;
}

export interface DaitaHttpContextConfig extends BaseContextConfig {
  options: {};
  authorization: undefined;
}
export interface DaitaSqliteContextConfig extends BaseContextConfig {
  options: {
    dropIfExists?: boolean;
  };
  authorization: AppAuthorization;
}
export interface DaitaPostgresContextConfig extends BaseContextConfig {
  options: {
    createIfNotExists?: boolean;
  };
  authorization: AppAuthorization;
}

export function getMigrationContextFromConfig(migrationTree: MigrationTree, options: any): MigrationContext {
  const client = getClientFromConfig(options);
  if (client instanceof RelationalMigrationClient) {
    return getMigrationContext(migrationTree, client);
  }
  throw new Error('adapter does not support migrations');
}

function getAdapterImpl<T>(
  options: any,
  contextConfig: DaitaContextConfig,
  defaultModule: string,
): RelationalAdapterImplementation<any, any> & MigrationAdapterImplementation<any, any> {
  const cwd = path.join(options?.cwd || process.cwd());
  if (contextConfig.module) {
    return require(path.join(cwd, contextConfig.module)).adapter;
  } else {
    return require(defaultModule).adapter;
  }
}

function getAdapter(options: any, contextConfig: DaitaContextConfig) {
  if (contextConfig.connectionString.startsWith('postgres://')) {
    return {
      adapter: getAdapterImpl<PostgresAdapterOptions>(options, contextConfig, '@daita/pg-adapter'),
      options: { ...(contextConfig.options || {}), connectionString: contextConfig.connectionString },
    };
  } else if (contextConfig.connectionString.startsWith('sqlite://')) {
    if (contextConfig.connectionString === 'sqlite://:memory:') {
      return {
        adapter: getAdapterImpl<SqliteAdapterOptions>(options, contextConfig, '@daita/sqlite-adapter'),
        options: { ...(contextConfig.options || {}), memory: true },
      };
    } else {
      return {
        adapter: getAdapterImpl<SqliteAdapterOptions>(options, contextConfig, '@daita/sqlite-adapter'),
        options: {
          ...(contextConfig.options || {}),
          file: contextConfig.connectionString.substr('sqlite://'.length),
        },
      };
    }
  } else if (
    contextConfig.connectionString.startsWith('http:') ||
    contextConfig.connectionString.startsWith('https:')
  ) {
    const globalConfig = getGlobalConfig();
    const token = globalConfig?.auth?.token;
    if (!token) {
      throw new Error('http-adapter requires login');
    }

    return {
      adapter: getAdapterImpl<HttpAdapterOptions>(options, contextConfig, '@daita/http-adapter'),
      options: {
        baseUrl: contextConfig.connectionString,
        authProvider: {
          token,
        },
      },
    };
  } else {
    throw new Error('unsupported connection string ' + contextConfig.connectionString);
  }
}

export async function getClientFromConfig(options: any): Promise<TransactionClient<any> | MigrationClient<any>> {
  const contextConfig = getProjectConfig(options);
  if (!contextConfig.connectionString) {
    throw new Error('missing connection string');
  }

  const adapter = getAdapter(options, contextConfig);
  return getClient(adapter.adapter, adapter.options);
}
