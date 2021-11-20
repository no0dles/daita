import { RelationalTransactionAdapter } from './relational-transaction-adapter';
import { RelationalDataAdapter } from './relational-data-adapter';

export interface RelationalTransactionAdapterImplementation<TQuery, TOptions> {
  getRelationalAdapter(options: TOptions): RelationalTransactionAdapter<TQuery>;
}

export interface RelationalDataAdapterImplementation<TQuery, TOptions> {
  getRelationalAdapter(options: TOptions): RelationalDataAdapter<TQuery>;
}
