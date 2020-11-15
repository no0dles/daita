import { table } from '../../keyword/table/table';
import { createPersonTable } from '../../../../../testing/schema/test-schema';
import { Person } from '../../../../../testing/schema/person';
import { testClient } from '../../../../../testing/relational/adapters';

describe('relational/sql/ddl/alter-table', () => {
  const clients = testClient('pg', 'sqlite');

  describe.each(clients)('%s', (client) => {
    beforeAll(async () => {
      await createPersonTable(client);
    });

    afterAll(() => client.close());

    it('should add column', async () => {
      await client.exec({
        alterTable: table(Person),
        add: {
          column: 'firstName2',
          type: 'string',
        },
      });
    });
  });
});
