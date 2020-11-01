import { Context } from './context';
import { Client } from '../../relational/client/client';

export interface TransactionContext<T> extends Context<T>, Client<T> {
  transaction<R>(action: (trx: Client<T>) => Promise<R>): Promise<R>;
}
