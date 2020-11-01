import { getContext } from './get-context';
import { RelationalAdapterMock } from '../../relational/testing';
import { OrmRelationalSchema } from '../schema/orm-relational-schema';
import { RelationalRawResult } from '../../relational/adapter/relational-raw-result';

export function getMockContext<T>(schema: OrmRelationalSchema, handle: (sql: T) => RelationalRawResult | null) {
  return getContext(new RelationalAdapterMock<T>(handle), schema);
}
