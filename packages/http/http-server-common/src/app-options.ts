import {isRelationalTransactionAdapter, RelationalDataAdapter, RelationalTransactionAdapter} from '@daita/relational';
import {AuthProvider} from './auth/auth-provider';

export type AppOptions = AppDataOptions | AppTransactionOptions;

export interface AppDataOptions {
  dataAdapter: RelationalDataAdapter;
  authProvider?: AuthProvider
}

export interface AppTransactionOptions {
  dataAdapter: RelationalTransactionAdapter;
  transactionTimeout?: number;
  authProvider?: AuthProvider
}

export const isAppTransactionOptions = (val: AppOptions): val is AppTransactionOptions => isRelationalTransactionAdapter(val.dataAdapter)
