import { createPerson, createPersonTable } from '../../../../../testing/schema/test-schema';
import { testClient } from '../../../../../testing/relational/adapters';

describe('relational/sql/ddl/create-table', () => {
  const clients = testClient('pg', 'sqlite', 'mariadb');
  describe.each(clients)('%s', (client) => {
    it('should create person table', async () => {
      await createPersonTable(client);
      await createPerson(client, {
        id: '59ce6315-ab96-4fe5-8a2a-70d0a7c8ac5b',
        firstName: 'Foo',
        lastName: 'Bar',
      });
    });

    afterAll(() => client.close());
  });
});
