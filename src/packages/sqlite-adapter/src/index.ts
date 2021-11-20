import { SqliteAdapterImplementation } from './adapter/sqlite-adapter-implementation';
import { SqliteTestAdapterImplementation } from './testing/sqlite-test-adapter';

export const adapter = new SqliteAdapterImplementation();
export const testAdapter = new SqliteTestAdapterImplementation();
