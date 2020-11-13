import { RelationalAdapterMock } from './relational-adapter-mock';
import { RelationalRawResult } from '../adapter/relational-raw-result';
import {
  RelationalDataAdapterImplementation,
  RelationalTransactionAdapterImplementation,
} from '../adapter/relational-adapter-implementation';
import { RelationalDataAdapter, RelationalTransactionAdapter } from '..';

export type MockAdapterOptions<T> = (sql: T) => RelationalRawResult | null;

export type MockAdapterImplementation<T> = RelationalDataAdapterImplementation<T, MockAdapterOptions<T>> &
  RelationalTransactionAdapterImplementation<T, MockAdapterOptions<T>>;

export const mockAdapter: MockAdapterImplementation<any> = {
  getRelationalAdapter(
    options: MockAdapterOptions<any>,
  ): RelationalDataAdapter<any> & RelationalTransactionAdapter<any> {
    return new RelationalAdapterMock(options);
  },
};
