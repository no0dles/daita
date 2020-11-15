import { table } from '../../keyword/table/table';
import {
  createAscentPersonTable,
  createAscentTable,
  createPersonTable,
} from '../../../../../testing/schema/test-schema';
import { Person } from '../../../../../testing/schema/person';
import { AscentPerson } from '../../../../../testing/schema/ascent-person';
import { Ascent } from '../../../../../testing/schema/ascent';
import { testClient } from '../../../../../testing/relational/adapters';

describe('relational/sql/ddl/alter-table', () => {
  const clients = testClient('pg');

  describe.each(clients)('%s', (client) => {
    beforeAll(async () => {
      await createPersonTable(client);
      await createAscentTable(client);
      await createAscentPersonTable(client);
    });

    afterAll(() => client.close());

    it('should drop column', async () => {
      await client.exec({
        alterTable: table(Person),
        drop: {
          column: 'firstName',
        },
      });
    });

    it('should drop foreign key with constraint name', async () => {
      await client.exec({
        alterTable: table(AscentPerson),
        add: {
          foreignKey: 'ascentId',
          constraint: 'ascent',
          references: {
            table: table(Ascent),
            primaryKeys: 'id',
          },
        },
      });
      await client.exec({
        alterTable: table(AscentPerson),
        drop: {
          constraint: 'ascent',
        },
      });
    });
  });
});
