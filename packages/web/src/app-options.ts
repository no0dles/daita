import {
  MigrationTree,
  RelationalDataAdapter,
  RelationalSchema,
} from '@daita/core';
import {TokenProvider} from './auth/token-provider';
import {UserProvider} from './auth/user-provider';

export interface BaseAppOptions {
  transactionTimeout?: number;
  auth?: {
    tokenProvider: TokenProvider;
    userProvider: UserProvider;
  }
}

export interface AppSchemaOptions extends BaseAppOptions {
  type: 'schema';
  dataAdapter: RelationalDataAdapter;
  schema: RelationalSchema;
}

export interface AppMigrationTreeOptions extends BaseAppOptions {
  type: 'migrationTree';
  dataAdapter: RelationalDataAdapter;
  migrationTree: MigrationTree;
}

export type AppOptions = (AppSchemaOptions | AppMigrationTreeOptions) & { type: 'schema' | 'migrationTree' };
