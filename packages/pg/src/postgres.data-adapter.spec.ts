import {relationalDataAdapterTest} from '@daita/core/dist/adapter/relational-data-adapter.test';
import {relationalContextTest} from '@daita/core/dist/context/relational-context.test';
import {PostgresDataAdapterFactory} from './postgres-data-adapter-factory.test';

describe('postgres.data-adapter', () => {
  relationalDataAdapterTest(new PostgresDataAdapterFactory('test-pg'), {remote: false});
  relationalContextTest(new PostgresDataAdapterFactory('test-pg2'));
});
