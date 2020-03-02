import {relationalDataAdapterTest} from '@daita/core/dist/adapter/relational-data-adapter.test';
import {PostgresDataAdapterFactory} from '@daita/pg/dist/postgres-data-adapter-factory.test';
import {ApiDataAdapterFactory} from '../relational-data-adapter.test';

describe('api-relational-data-adapter', () => {
  const factory = new ApiDataAdapterFactory(new PostgresDataAdapterFactory('test-api'));

  relationalDataAdapterTest(factory, {remote: true});
});
