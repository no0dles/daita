import { OrmRelationalSchema } from '../schema';
import { TransactionContext } from './transaction-context';
import { RelationalTransactionContext } from './relational-transaction-context';
import { RelationalTransactionAdapter } from '../../relational/adapter';

export function getContext<T>(
  adapter: RelationalTransactionAdapter<T>,
  schema: OrmRelationalSchema,
): TransactionContext<T> {
  return new RelationalTransactionContext(adapter, schema);
}
