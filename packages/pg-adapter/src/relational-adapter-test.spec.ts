import { relationalTest } from '@daita/relational-test';
import { adapterFactory } from './index';

describe('postgres', () => {
  relationalTest(() => adapterFactory.createTransactionAdapter({
    connectionString: 'postgres://postgres:postgres@localhost/postgres',
  }));
});
