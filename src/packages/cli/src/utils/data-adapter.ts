import { getGlobalConfig, getProjectConfig } from './config';
import { HttpAdapterOptions } from '@daita/http-adapter';
import { SqliteAdapterOptions } from '@daita/sqlite-adapter';
import { PostgresAdapterOptions } from '@daita/pg-adapter';
import { join, relative } from 'path';
import { RelationalAdapter, RelationalAdapterImplementation } from '@daita/relational';
import { HttpServerAuthorizationProvider, HttpServerAuthorizationTokenEndpoint } from '@daita/http-server';
import { UserPoolAlgorithm } from '@daita/auth';
import { RelationalOrmAdapter } from '@daita/orm';

export type DaitaContextConfig = DaitaHttpContextConfig | DaitaSqliteContextConfig | DaitaPostgresContextConfig;

export interface BaseContextConfig {
  module?: string;
  connectionString: string; //TODO ts 4.1
  schemaLocation?: string;
  schemaName?: string;
  migrationLocation?: string;
}

export interface DaitaHttpContextConfig extends BaseContextConfig {
  options: any;
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
  providers?: HttpServerAuthorizationProvider[];
  tokenEndpoints?: HttpServerAuthorizationTokenEndpoint[];
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
): RelationalAdapterImplementation<any, any, any> {
  const cwd = join(options?.cwd || process.cwd());
  if (contextConfig.module) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(relative(__dirname, join(cwd, contextConfig.module))).adapter;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
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
        auth: {
          token,
        },
      },
    };
  } else {
    throw new Error('unsupported connection string ' + contextConfig.connectionString);
  }
}

export function getContextFromConfig(options: any): RelationalAdapter<any> & RelationalOrmAdapter {
  const contextConfig = getProjectConfig(options);
  if (!contextConfig.connectionString) {
    throw new Error('missing connection string');
  }

  const adapter = getAdapter(options, contextConfig);

  return adapter.adapter.getRelationalAdapter(adapter.options);
}
