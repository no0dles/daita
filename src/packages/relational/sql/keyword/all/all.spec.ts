import { all } from './all';
import { table } from '../table/table';
import { createPerson, createPersonTable } from '../../../../../testing/schema/test-schema';
import { Person } from '../../../../../examples/mowntain/models/person';
import { testClient } from '../../../../../testing/relational/adapters';

describe('relational/sql/keyword/all', () => {
  const clients = testClient('pg', 'sqlite', 'mariadb');

  describe.each(clients)('%s', (client) => {
    const id = 'c9e973ce-82e8-48e8-b2f3-ec8e4d72418b';
    beforeAll(async () => {
      await createPersonTable(client);
      await createPerson(client, { firstName: 'Foo', lastName: 'Bar', id });
    });

    afterAll(() => client.close());

    it('should select all fields', async () => {
      const result = await client.selectFirst({
        select: all(),
        from: table(Person),
      });
      expect(result).toEqual({ firstName: 'Foo', lastName: 'Bar', id, birthday: null, active: true });
    });

    it('should select all fields from table', async () => {
      const result = await client.selectFirst({
        select: all(Person),
        from: table(Person),
      });
      expect(result).toEqual({ firstName: 'Foo', lastName: 'Bar', id, birthday: null, active: true });
    });
  });
});
