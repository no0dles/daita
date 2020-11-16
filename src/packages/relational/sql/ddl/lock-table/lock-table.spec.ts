import { table } from '../../keyword/table/table';
import { createPersonTable } from '../../../../../testing/schema/test-schema';
import { Person } from '../../../../../docs/example/models/person';
import { testClient } from '../../../../../testing/relational/adapters';

describe('relational/sql/ddl/lock-table', () => {
  const clients = testClient('pg');

  describe.each(clients)('%s', (client) => {
    beforeAll(async () => {
      await createPersonTable(client);
    });

    afterAll(() => client.close());

    it('should lock person table', async () => {
      await client.transaction(async (trx) => {
        await trx.exec({
          lockTable: table(Person),
        });
      });
    });
  });
});
