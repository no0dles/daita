import { Context } from './context';
import { Client } from '../../relational/client/client';
import { MigrationContext } from './get-migration-context';
import { TransactionClient } from '../../relational/client/transaction-client';

export interface TransactionContext<T> extends Context<T>, TransactionClient<T> {
  transaction<R>(action: (trx: Client<T>) => Promise<R>): Promise<R>;
}

export const isTransactionContext = (val: Context<any> | TransactionContext<any>): val is MigrationContext<any> =>
  typeof (<any>val).transaction === 'function';
