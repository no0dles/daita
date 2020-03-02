import {relationalDataAdapterTest} from '@daita/core/dist/adapter/relational-data-adapter.test';
import {PostgresDataAdapterFactory} from '@daita/pg/dist/postgres-data-adapter-factory.test';
import {SocketDataAdapterFactory} from '../relational-data-adapter.test';


describe('socket-relational-data-adapter', () => {
  const factory = new SocketDataAdapterFactory(new PostgresDataAdapterFactory('test-socket'));

  relationalDataAdapterTest(factory, {remote: true});
});
