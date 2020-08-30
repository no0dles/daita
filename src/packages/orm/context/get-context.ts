import { OrmRelationalSchema } from '../schema';
import { TransactionContext } from './transaction-context';
import { RelationalTransactionContext } from './relational-transaction-context';
import { RelationalContext } from './relational-context';
import { Context } from './context';
import {
  isRelationalTransactionAdapter,
  RelationalDataAdapter,
  RelationalTransactionAdapter,
} from '../../relational/adapter';
import { Client } from '../../relational/client';

export function getContext<T>(
  client: RelationalTransactionAdapter<T>,
  schema: OrmRelationalSchema,
): TransactionContext<T> & Client<T>;
export function getContext<T>(
  client: RelationalDataAdapter<T>,
  schema: OrmRelationalSchema,
): Context<T> & Client<T>;
export function getContext<T>(
  client: RelationalTransactionAdapter<T> | RelationalDataAdapter<T>,
  schema: OrmRelationalSchema,
): Context<T> | TransactionContext<T> {
  if (isRelationalTransactionAdapter(client)) {
    return new RelationalTransactionContext(client, schema);
  } else {
    return new RelationalContext(client, schema);
  }
}
