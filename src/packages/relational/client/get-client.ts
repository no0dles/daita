import { RelationalClient } from './relational-client';
import { RelationalTransactionClient } from './relational-transaction-client';
import {
  isRelationalTransactionAdapter,
  RelationalDataAdapter,
  RelationalTransactionAdapter,
} from '../adapter';
import { TransactionClient } from './transaction-client';
import { Client } from './client';

export function getClient<T>(
  dataAdapter: RelationalTransactionAdapter<T>,
): TransactionClient<Client<T>> & Client<T>;
export function getClient<T>(dataAdapter: RelationalDataAdapter<T>): Client<T>;
export function getClient<T>(
  dataAdapter: RelationalDataAdapter<T> | RelationalTransactionAdapter<T>,
): Client<T> | TransactionClient<Client<T>> {
  if (isRelationalTransactionAdapter(dataAdapter)) {
    return new RelationalTransactionClient(dataAdapter);
  } else {
    return new RelationalClient(dataAdapter);
  }
}
