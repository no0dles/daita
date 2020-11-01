import { RelationalTransactionClient } from './relational-transaction-client';
import { TransactionClient } from './transaction-client';
import { RelationalAdapterImplementation } from '../adapter/relational-adapter-implementation';

export function getClient<TQuery, TOptions>(
  adapterImplementation: RelationalAdapterImplementation<TQuery, TOptions>,
  options?: TOptions,
): TransactionClient<TQuery> {
  const dataAdapter = adapterImplementation.getAdapter(options);
  return new RelationalTransactionClient(dataAdapter);
}
