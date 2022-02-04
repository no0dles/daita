import { RelationalAdapterMockImplementation } from './relational-adapter-mock';
import { RelationalRawResult } from '../adapter/relational-raw-result';
import { RelationalAdapterImplementation } from '../adapter/relational-adapter-implementation';
import { RelationalAdapter } from '../adapter';

export type MockAdapterOptions<T> = (sql: T) => RelationalRawResult | null;

export type MockAdapterImplementation<TAdapter extends RelationalAdapter<TSql>, TSql> = RelationalAdapterImplementation<
  TAdapter,
  TSql,
  MockAdapterOptions<TSql>
>;

export const mockAdapter = new RelationalAdapterMockImplementation();
