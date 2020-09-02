import {
  RelationalAdapterImplementation,
  RelationalRawResult,
  RelationalTransactionAdapter,
} from '../adapter';
import { RelationalAdapterMock } from './relational-adapter-mock';

export type MockAdapterOptions<T> = (sql: T) => RelationalRawResult | null;

export type MockAdapterImplementation<T> = RelationalAdapterImplementation<
  T,
  MockAdapterOptions<T>
>;

export const mockAdapter: MockAdapterImplementation<any> = {
  getAdapter(
    options?: MockAdapterOptions<any>,
  ): RelationalTransactionAdapter<any> {
    if (!options) {
      throw new Error('Mock adapter requires options'); //TODO create requriedoptions interface for adapter implementation
    }
    return new RelationalAdapterMock(options);
  },
};
