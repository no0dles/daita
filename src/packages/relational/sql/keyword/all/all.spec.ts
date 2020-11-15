import { all } from './all';
import { table } from '../table/table';
import { createPerson, createPersonTable } from '../../../../../testing/schema/test-schema';
import { Person } from '../../../../../testing/schema/person';
import { testClient } from '../../../../../testing/relational/adapters';

describe('relational/sql/keyword/all', () => {
  const clients = testClient('pg', 'sqlite');

  describe.each(clients)('%s', (client) => {
    beforeAll(async () => {
      await createPersonTable(client);
      await createPerson(client, { firstName: 'Foo', lastName: 'Bar', id: 'a' });
    });

    afterAll(() => client.close());

    it('should select all fields', async () => {
      const result = await client.selectFirst({
        select: all(),
        from: table(Person),
      });
      expect(result).toEqual({ firstName: 'Foo', lastName: 'Bar', id: 'a', birthday: null });
    });

    it('should select all fields from table', async () => {
      const result = await client.selectFirst({
        select: all(Person),
        from: table(Person),
      });
      expect(result).toEqual({ firstName: 'Foo', lastName: 'Bar', id: 'a', birthday: null });
    });
  });
});
