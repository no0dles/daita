import { getGlobalConfig, getProjectConfig } from './config';
import { HttpAdapterOptions } from '../../http-adapter/adapter-implementation';
import { SqliteAdapterOptions } from '../../sqlite-adapter/sqlite-adapter-implementation';
import { PostgresAdapterOptions } from '../../pg-adapter/adapter-implementation';
import { AppAuthorization } from '../../http-server-common/app-authorization';
import { TransactionClient } from '../../relational/client/transaction-client';
import { RelationalAdapterImplementation } from '../../relational/adapter/relational-adapter-implementation';
import { getClient } from '../../relational/client/get-client';

export type DaitaContextConfig = DaitaHttpContextConfig | DaitaSqliteContextConfig | DaitaPostgresContextConfig;

export interface BaseContextConfig {
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

export async function getClientFromConfig(options: any): Promise<TransactionClient<any>> {
  const contextConfig = getProjectConfig(options);
  if (!contextConfig.connectionString) {
    throw new Error('missing connection string');
  }

  if (contextConfig.connectionString.startsWith('postgres://')) {
    const adapter: RelationalAdapterImplementation<any, PostgresAdapterOptions> = require('@daita/pg-adapter').adapter;
    return getClient(adapter, { ...(contextConfig.options || {}), connectionString: contextConfig.connectionString });
  } else if (contextConfig.connectionString.startsWith('sqlite://')) {
    const adapter: RelationalAdapterImplementation<any, SqliteAdapterOptions> = require('@daita/sqlite-adapter')
      .adapter;
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

    const adapter: RelationalAdapterImplementation<any, HttpAdapterOptions> = require('@daita/http-adapter').adapter;
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
