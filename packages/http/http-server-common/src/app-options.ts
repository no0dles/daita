import {
  isRelationalTransactionAdapter,
  RelationalDataAdapter,
  RelationalTransactionAdapter,
  Rule,
} from '@daita/relational';
import { AppAuthorization } from './app-authorization';

export type AppOptions = AppDataOptions | AppTransactionOptions;

export interface AppDataOptions {
  dataAdapter: RelationalDataAdapter;
  cors?: boolean | string | string[];
  authorization?: AppAuthorization;
  rules: Rule[];
}

export interface AppTransactionOptions {
  dataAdapter: RelationalTransactionAdapter;
  transactionTimeout?: number;
  cors?: boolean | string | string[];
  authorization?: AppAuthorization;
  rules: Rule[];
}

export const isAppTransactionOptions = (val: AppOptions): val is AppTransactionOptions => isRelationalTransactionAdapter(val.dataAdapter)
