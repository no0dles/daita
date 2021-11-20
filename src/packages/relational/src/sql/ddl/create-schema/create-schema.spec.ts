import { testClient } from '../../../../../testing/relational/adapters';

describe('relational/sql/ddl/create-schema', () => {
  const clients = testClient('pg', 'mariadb');

  describe.each(clients)('%s', (client) => {
    afterAll(() => client.close());

    it('should create schema', async () => {
      await client.exec({
        createSchema: 'auth',
      });
    });

    it('should create schema if not exists', async () => {
      await client.exec({
        createSchema: 'auth',
        ifNotExists: true,
      });
    });
  });
});
