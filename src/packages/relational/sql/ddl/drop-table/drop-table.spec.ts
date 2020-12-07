import { table } from '../../keyword/table/table';
import { testClient } from '../../../../../testing/relational/adapters';
import { createPersonTable } from '../../../../../testing/schema/test-schema';
import { Person } from '../../../../../examples/mowntain/models/person';

describe('relational/sql/ddl/drop-table', () => {
  const clients = testClient('pg', 'sqlite', 'mariadb');

  describe.each(clients)('%s', (client) => {
    beforeAll(async () => {
      await createPersonTable(client);
    });

    afterAll(() => client.close());

    it('should create person table', async () => {
      await client.exec({
        dropTable: table(Person),
      });
    });

    it('should create person table if exists', async () => {
      await client.exec({
        dropTable: table(Person),
        ifExists: true,
      });
    });
  });
});
