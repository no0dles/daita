import { Client } from './client';

export interface TransactionClient<T> extends Client<T> {
  transaction<R>(action: (trx: Client<T>) => Promise<R>): Promise<R>;
  close(): Promise<void>;
}
