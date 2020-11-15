import { AppAuthorization } from './app-authorization';
import { Rule } from '../relational/permission/description/rule';
import { Context, TransactionContext } from '../orm';
import { isTransactionContext } from '../orm/context/transaction-context';

export type AppOptions = HttpServerTransactionOptions | HttpServerDataOptions;

export interface BaseHttpOptions {
  transactionTimeout?: number;
  cors?: boolean | string | string[];
  authorization: AppAuthorization | false;
}

export interface HttpServerTransactionOptions extends BaseHttpOptions {
  context: TransactionContext<any>;
}

export const isHttpServerTransactionOptions = (val: AppOptions): val is HttpServerTransactionOptions =>
  isTransactionContext(val.context);

export interface HttpServerDataOptions extends BaseHttpOptions {
  context: Context<any>;
}
