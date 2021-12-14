import { AuthorizedClient, Client } from './client';
import { RelationalDataAdapter } from '../adapter/relational-data-adapter';
import { Rule, RuleContext, RulesEvaluator } from '../permission';

export interface TransactionClient<T> extends Client<T> {
  dataAdapter: RelationalDataAdapter<T>;
  transaction<R>(action: (trx: Client<T>) => Promise<R>): Promise<R>;
  close(): Promise<void>;
  authorizable(auth: { id: string; rule: Rule }[]): AuthorizableTransactionClient<T>;
}

export const isTransactionClient = (val: Client<any> | TransactionClient<any>): val is TransactionClient<any> =>
  typeof (<any>val).transaction === 'function';

export interface AuthorizableTransactionClient<T> {
  authorize(auth: RuleContext): AuthorizedTransactionClient<T>;
}

export interface AuthorizedTransactionClient<T> extends AuthorizedClient<T> {
  dataAdapter: RelationalDataAdapter<T>;
  transaction<R>(action: (trx: AuthorizedClient<T>) => Promise<R>): Promise<R>;
  close(): Promise<void>;
  isAuthorized(sql: T): boolean;
}
