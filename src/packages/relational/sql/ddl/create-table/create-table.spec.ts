import { createPerson, createPersonTable } from '../../../../../testing/schema/test-schema';
import { testClient } from '../../../../../testing/relational/adapters';

describe('relational/sql/ddl/create-table', () => {
  const clients = testClient('pg', 'sqlite');
  describe.each(clients)('%s', (client) => {
    it('should create person table', async () => {
      await createPersonTable(client);
      await createPerson(client, {
        id: 'a',
        firstName: 'Foo',
        lastName: 'Bar',
      });
    });

    afterAll(() => client.close());
  });
});
