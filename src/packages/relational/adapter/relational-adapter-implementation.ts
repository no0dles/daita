import { RelationalTransactionAdapter } from './relational-transaction-adapter';

export interface RelationalAdapterImplementation<TQuery, TOptions> {
  getAdapter(options?: TOptions): RelationalTransactionAdapter<TQuery>;
}
