import { RelationalSchema } from '../schema';
import { RelationalAdapterMock, RelationalRawResult } from '@daita/relational';
import { getContext } from './get-context';

export function getMockContext<T>(schema: RelationalSchema, handle: (sql: T) => RelationalRawResult | null) {
  return getContext(new RelationalAdapterMock<T>(handle), schema);
}
