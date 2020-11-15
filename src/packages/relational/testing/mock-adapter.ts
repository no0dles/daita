import { RelationalAdapterMockImplementation } from './relational-adapter-mock';
import { RelationalRawResult } from '../adapter/relational-raw-result';
import {
  RelationalDataAdapterImplementation,
  RelationalTransactionAdapterImplementation,
} from '../adapter/relational-adapter-implementation';

export type MockAdapterOptions<T> = (sql: T) => RelationalRawResult | null;

export type MockAdapterImplementation<T> = RelationalDataAdapterImplementation<T, MockAdapterOptions<T>> &
  RelationalTransactionAdapterImplementation<T, MockAdapterOptions<T>>;

export const mockAdapter = new RelationalAdapterMockImplementation();
