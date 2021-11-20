import { Context } from './context';
import { Client } from '@daita/relational';
import { MigrationContext } from './get-migration-context';
import { TransactionClient } from '@daita/relational';
import { RuleContext } from '@daita/relational';

export interface TransactionContext<T> extends Context<T>, TransactionClient<T> {
  transaction<R>(action: (trx: Context<T>) => Promise<R>): Promise<R>;
  authorize(auth: RuleContext): TransactionContext<T>;
}

export const isTransactionContext = (val: Context<any> | TransactionContext<any>): val is MigrationContext<any> =>
  typeof (<any>val).transaction === 'function';
