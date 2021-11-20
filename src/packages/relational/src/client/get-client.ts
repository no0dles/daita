import { RelationalTransactionClient } from './relational-transaction-client';
import { TransactionClient } from './transaction-client';
import {
  RelationalDataAdapterImplementation,
  RelationalTransactionAdapterImplementation,
} from '../adapter/relational-adapter-implementation';
import { isRelationalTransactionAdapter } from '../adapter/relational-transaction-adapter';
import { RelationalClient } from './relational-client';
import { Client } from './client';

export function getClient<TQuery, TOptions>(
  adapterImplementation: RelationalTransactionAdapterImplementation<TQuery, TOptions>,
  options: TOptions,
): TransactionClient<TQuery>;
export function getClient<TQuery, TOptions>(
  adapterImplementation: RelationalDataAdapterImplementation<TQuery, TOptions>,
  options: TOptions,
): Client<TQuery>;
export function getClient<TQuery, TOptions>(
  adapterImplementation:
    | RelationalDataAdapterImplementation<TQuery, TOptions>
    | RelationalTransactionAdapterImplementation<TQuery, TOptions>,
  options: TOptions,
): TransactionClient<TQuery> | Client<TQuery> {
  const dataAdapter = adapterImplementation.getRelationalAdapter(options);
  if (isRelationalTransactionAdapter(dataAdapter)) {
    return new RelationalTransactionClient(dataAdapter);
  } else {
    return new RelationalClient(dataAdapter);
  }
}
