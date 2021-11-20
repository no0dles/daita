import { Context } from './context';
import { Client } from '@daita/relational/client/client';
import { MigrationContext } from './get-migration-context';
import { TransactionClient } from '@daita/relational/client/transaction-client';
import { RuleContext } from '@daita/relational/permission/description/rule-context';

export interface TransactionContext<T> extends Context<T>, TransactionClient<T> {
  transaction<R>(action: (trx: Context<T>) => Promise<R>): Promise<R>;
  authorize(auth: RuleContext): TransactionContext<T>;
}

export const isTransactionContext = (val: Context<any> | TransactionContext<any>): val is MigrationContext<any> =>
  typeof (<any>val).transaction === 'function';
