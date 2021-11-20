import { Client } from './client';
import { RelationalDataAdapter } from '../adapter/relational-data-adapter';

export interface TransactionClient<T> extends Client<T> {
  dataAdapter: RelationalDataAdapter<T>;
  transaction<R>(action: (trx: Client<T>) => Promise<R>): Promise<R>;
  close(): Promise<void>;
}

export const isTransactionClient = (val: Client<any> | TransactionClient<any>): val is TransactionClient<any> =>
  typeof (<any>val).transaction === 'function';
