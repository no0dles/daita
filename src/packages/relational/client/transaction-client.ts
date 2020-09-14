import { Client } from './client';
import { RelationalDataAdapter } from '../adapter';

export interface TransactionClient<T> extends Client<T> {
  dataAdapter: RelationalDataAdapter<T>;
  transaction<R>(action: (trx: Client<T>) => Promise<R>): Promise<R>;
  close(): Promise<void>;
}
