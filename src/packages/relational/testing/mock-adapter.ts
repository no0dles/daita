import { RelationalAdapterMock } from './relational-adapter-mock';
import { RelationalTransactionAdapter } from '../adapter/relational-transaction-adapter';
import { RelationalAdapterImplementation } from '../adapter/relational-adapter-implementation';
import { RelationalRawResult } from '../adapter/relational-raw-result';

export type MockAdapterOptions<T> = (sql: T) => RelationalRawResult | null;

export type MockAdapterImplementation<T> = RelationalAdapterImplementation<T, MockAdapterOptions<T>>;

export const mockAdapter: MockAdapterImplementation<any> = {
  getAdapter(options?: MockAdapterOptions<any>): RelationalTransactionAdapter<any> {
    if (!options) {
      throw new Error('Mock adapter requires options'); //TODO create requriedoptions interface for adapter implementation
    }
    return new RelationalAdapterMock(options);
  },
};
