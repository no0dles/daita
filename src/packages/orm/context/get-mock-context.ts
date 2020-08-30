import { OrmRelationalSchema } from '../schema';
import { getContext } from './get-context';
import {RelationalRawResult} from '../../relational/adapter';
import {RelationalAdapterMock} from '../../relational/testing';

export function getMockContext<T>(schema: OrmRelationalSchema, handle: (sql: T) => RelationalRawResult | null) {
  return getContext(new RelationalAdapterMock<T>(handle), schema);
}
