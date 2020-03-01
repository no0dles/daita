import {relationalDataAdapterTest} from '@daita/core/dist/adapter/relational-data-adapter.test';
import {ApiDataAdapterFactory} from './relational-data-adapter.test';
import {PostgresDataAdapterFactory} from '@daita/pg/dist/postgres.data-adapter.spec';
import {relationalTransactionRemoteTest} from '@daita/core/dist/context/relational-transaction.test';

describe('api-relational-data-adapter', () => {
  const factory = new ApiDataAdapterFactory(new PostgresDataAdapterFactory());

  relationalDataAdapterTest(factory);
  relationalTransactionRemoteTest(factory)
});
