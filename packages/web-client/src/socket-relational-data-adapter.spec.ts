import {relationalDataAdapterTest} from '@daita/core/dist/adapter/relational-data-adapter.test';
import {PostgresDataAdapterFactory} from '@daita/pg/dist/postgres.data-adapter.spec';
import {SocketDataAdapterFactory} from './relational-data-adapter.test';
import {relationalTransactionRemoteTest} from '@daita/core/dist/context/relational-transaction.test';

describe('socket-relational-data-adapter', () => {
  const factory = new SocketDataAdapterFactory(new PostgresDataAdapterFactory());

  relationalDataAdapterTest(factory);
  relationalTransactionRemoteTest(factory);
});
