import { RelationalTransactionAdapter } from './relational-transaction-adapter';
import { RelationalDataAdapter } from './relational-data-adapter';

export interface RelationalTransactionAdapterImplementation<TQuery, TOptions> {
  getRelationalAdapter(options: TOptions): RelationalTransactionAdapter<TQuery>;
  supportsQuery<S>(sql: S): this is RelationalTransactionAdapterImplementation<TQuery | S, TOptions>;
}

export interface RelationalDataAdapterImplementation<TQuery, TOptions> {
  getRelationalAdapter(options: TOptions): RelationalDataAdapter<TQuery>;
  supportsQuery<S>(sql: S): this is RelationalDataAdapterImplementation<TQuery | S, TOptions>;
}
