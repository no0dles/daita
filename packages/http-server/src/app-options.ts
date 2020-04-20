import {
  RelationalDataAdapter,
} from '@daita/core';
import {TokenProvider} from './auth/token-provider';

export interface AppOptions {
  dataAdapter: RelationalDataAdapter;
  transactionTimeout?: number;
  auth?: {
    tokenProvider: TokenProvider;
  }
}
