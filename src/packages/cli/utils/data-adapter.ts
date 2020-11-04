import { getGlobalConfig, getProjectConfig } from './config';
import { HttpAdapterOptions } from '../../http-adapter/adapter-implementation';
import { SqliteAdapterOptions } from '../../sqlite-adapter/sqlite-adapter-implementation';
import { PostgresAdapterOptions } from '../../pg-adapter/adapter';
import { AppAuthorization } from '../../http-server-common/app-authorization';
import { TransactionClient } from '../../relational/client/transaction-client';
import { RelationalAdapterImplementation } from '../../relational/adapter/relational-adapter-implementation';
import { getClient } from '../../relational/client/get-client';
import path from 'path';
import { MigrationContext } from '../../orm/context/get-migration-context';

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

export async function getMigrationContextFromConfig(): MigrationContext {}

export async function getClientFromConfig(options: any): Promise<TransactionClient<any>> {
  const contextConfig = getProjectConfig(options);
  if (!contextConfig.connectionString) {
    throw new Error('missing connection string');
  }

  function getAdapterImpl<T>(defaultModule: string): RelationalAdapterImplementation<any, T> {
    const cwd = path.join(options?.cwd || process.cwd());
    if (contextConfig.module) {
      return require(path.join(cwd, contextConfig.module)).adapter;
    } else {
      return require(defaultModule).adapter;
    }
  }

  if (contextConfig.connectionString.startsWith('postgres://')) {
    const adapter = getAdapterImpl<PostgresAdapterOptions>('@daita/pg-adapter');
    return getClient(adapter, { ...(contextConfig.options || {}), connectionString: contextConfig.connectionString });
  } else if (contextConfig.connectionString.startsWith('sqlite://')) {
    const adapter = getAdapterImpl<SqliteAdapterOptions>('@daita/sqlite-adapter');
    if (contextConfig.connectionString === 'sqlite://:memory:') {
      return getClient(adapter, { ...(contextConfig.options || {}), memory: true });
    } else {
      return getClient(adapter, {
        ...(contextConfig.options || {}),
        file: contextConfig.connectionString.substr('sqlite://'.length),
      });
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

    const adapter = getAdapterImpl<HttpAdapterOptions>('@daita/http-adapter');
    return getClient(adapter, {
      baseUrl: contextConfig.connectionString,
      authProvider: {
        token,
      },
    });
  } else {
    throw new Error('unsupported connection string ' + contextConfig.connectionString);
  }
}
