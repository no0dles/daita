import { AppAuthorization } from './app-authorization';
import {
  isRelationalTransactionAdapter,
  RelationalDataAdapter,
  RelationalTransactionAdapter,
} from '../relational/adapter';
import { Rule } from '../relational/permission/description';

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

export const isAppTransactionOptions = (
  val: AppOptions,
): val is AppTransactionOptions =>
  isRelationalTransactionAdapter(val.dataAdapter);
