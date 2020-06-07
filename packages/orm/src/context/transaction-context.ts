import { Context } from './context';
import { Client } from '@daita/relational';

export interface TransactionContext<T> extends Context<T> {
  transaction<R>(action: (trx: Client<T>) => Promise<R>): Promise<R>
}
