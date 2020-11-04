import { RelationalTransactionAdapter } from './relational-transaction-adapter';

export interface RelationalAdapterImplementation<TQuery, TOptions> {
  getRelationalAdapter(options?: TOptions): RelationalTransactionAdapter<TQuery>;
}
