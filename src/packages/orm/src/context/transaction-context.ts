import { Context } from './context';
import { MigrationContext } from './get-migration-context';
import { RuleContext } from '@daita/relational';
import { AuthorizedContext } from './authorized-context';

export interface TransactionContext<T> extends Context<T> {
  authorize(auth: RuleContext): AuthorizedTransactionContext<T>;
  transaction<R>(action: (trx: Context<T>) => Promise<R>): Promise<R>;
}

export const isTransactionContext = (val: Context<any> | TransactionContext<any>): val is MigrationContext<any> =>
  typeof (<any>val).transaction === 'function';

export interface AuthorizedTransactionContext<T> extends AuthorizedContext<T> {
  transaction<R>(action: (trx: AuthorizedContext<T>) => Promise<R>): Promise<R>;
}
