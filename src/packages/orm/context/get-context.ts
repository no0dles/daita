import { TransactionContext } from './transaction-context';
import { RelationalTransactionContext } from './relational-transaction-context';
import { RelationalTransactionAdapter } from '../../relational/adapter/relational-transaction-adapter';
import { OrmRelationalSchema } from '../schema/orm-relational-schema';

export function getContext<T>(
  adapter: RelationalTransactionAdapter<T>,
  schema: OrmRelationalSchema,
): TransactionContext<T> {
  return new RelationalTransactionContext(adapter, schema);
}
