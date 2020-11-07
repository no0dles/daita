import { getContext } from './get-context';
import { OrmRelationalSchema } from '../schema/orm-relational-schema';
import { RelationalRawResult } from '../../relational/adapter/relational-raw-result';
import { RelationalAdapterMock } from '../../relational/testing/relational-adapter-mock';

export function getMockContext<T>(schema: OrmRelationalSchema, handle: (sql: T) => RelationalRawResult | null) {
  return getContext(new RelationalAdapterMock<T>(handle), schema);
}
