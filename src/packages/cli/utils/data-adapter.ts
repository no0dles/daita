import { getGlobalConfig, getProjectConfig } from './config';
import { HttpAdapterOptions } from '../../http-adapter/adapter-implementation';
import { SqliteAdapterOptions } from '../../sqlite-adapter/adapter/sqlite-adapter-implementation';
import { PostgresAdapterOptions } from '../../pg-adapter/adapter/adapter';
import path from 'path';
import { MigrationContext } from '../../orm/context/get-migration-context';
import {
  RelationalDataAdapterImplementation,
  RelationalTransactionAdapterImplementation,
} from '../../relational/adapter/relational-adapter-implementation';
import { RelationalMigrationAdapterImplementation } from '../../orm/adapter/relational-migration-adapter-implementation';
import { MigrationTree } from '../../orm/migration/migration-tree';
import { getContext } from '../../orm/context/get-context';
import { AppAuthorizationProvider, AppAuthorizationTokenEndpoint } from '../../http-server-common/app-authorization';
import { UserPoolAlgorithm } from '../../auth-server/models/user-pool';

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
  authorization: DaitaAuthorizationConfig;
}
export interface DaitaPostgresContextConfig extends BaseContextConfig {
  options: {
    createIfNotExists?: boolean;
  };
  authorization: DaitaAuthorizationConfig;
}
export interface DaitaAuthorizationConfig {
  providers?: AppAuthorizationProvider[];
  tokenEndpoints?: AppAuthorizationTokenEndpoint[];
  userPools?: { [key: string]: DaitaAuthorizationIssuerConfig };
}
export interface DaitaAuthorizationIssuerConfig {
  users?: { [key: string]: DaitaAuthorizationIssuerUserConfig };
  cors?: string[];
  roles?: { [key: string]: DaitaAuthorizationIssuerRoleConfig };
  name?: string;
  accessTokenExpiresIn?: number;
  algorithm?: UserPoolAlgorithm;
  allowRegistration?: boolean;
  checkPasswordForBreach?: boolean;
  emailVerifyExpiresIn?: number;
  refreshRefreshExpiresIn?: number;
}
export interface DaitaAuthorizationIssuerRoleConfig {
  description?: string;
}
export interface DaitaAuthorizationIssuerUserConfig {
  password: string;
  email?: string;
  emailVerified?: boolean;
  phone?: string;
  phoneVerified?: boolean;
  roles?: string[];
  disabled?: boolean;
}

function getAdapterImpl<T>(
  options: any,
  contextConfig: DaitaContextConfig,
  defaultModule: string,
): RelationalTransactionAdapterImplementation<any, any> &
  RelationalMigrationAdapterImplementation<any, any> &
  RelationalDataAdapterImplementation<any, any> {
  const cwd = path.join(options?.cwd || process.cwd());
  if (contextConfig.module) {
    return require(path.relative(__dirname, path.join(cwd, contextConfig.module))).adapter;
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

export function getContextFromConfig(options: any, migrationTree: MigrationTree): MigrationContext<any> {
  const contextConfig = getProjectConfig(options);
  if (!contextConfig.connectionString) {
    throw new Error('missing connection string');
  }

  const adapter = getAdapter(options, contextConfig);

  return getContext(adapter.adapter, { ...adapter.options, migrationTree });
}
