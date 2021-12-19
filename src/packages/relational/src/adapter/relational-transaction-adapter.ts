import { RelationalDataAdapter } from './relational-data-adapter';
import { Sql } from '../sql/sql';

export interface RelationalTransactionAdapter<TQuery = Sql<any>> extends RelationalDataAdapter<TQuery> {
  transaction<T>(action: (adapter: RelationalDataAdapter<TQuery>) => Promise<T>, timeout?: number): Promise<T>;
}

export const isRelationalTransactionAdapter = (val: any): val is RelationalTransactionAdapter =>
  typeof val.transaction === 'function';
