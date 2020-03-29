import {
  RelationalDataAdapter,
} from '@daita/core';
import {TokenProvider} from './auth/token-provider';
import {UserProvider} from './auth/user-provider';
import {SchemaPermissions} from '@daita/core/dist/permission/permission-builder';

export interface AppOptions {
  dataAdapter: RelationalDataAdapter;
  transactionTimeout?: number;
  auth?: {
    tokenProvider: TokenProvider;
    userProvider: UserProvider;
    permissions: SchemaPermissions
  }
}
