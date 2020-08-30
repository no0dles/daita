import { getClient } from "../client/get-client";
import { RelationalAdapterMock } from './relational-adapter-mock';
import { RelationalRawResult } from '../adapter';

export function getMockClient<T>(handle: (sql: T) => RelationalRawResult | null) {
  return getClient<T>(new RelationalAdapterMock(handle));
}
