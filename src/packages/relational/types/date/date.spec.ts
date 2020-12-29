import { field } from '../../sql/keyword/field/field';
import { testClient } from '../../../../testing/relational/adapters';
import { createPerson, createPersonTable } from '../../../../testing/schema/test-schema';
import { table } from '../../sql/keyword/table/table';
import { Person } from '../../../../examples/mowntain/models/person';

describe('relational/types/date', () => {
  const clients = testClient('pg', 'sqlite', 'mariadb');
  const date = new Date();

  describe.each(clients)('%s', (client) => {
    beforeAll(async () => {
      await createPersonTable(client);
      await createPerson(client, {
        birthday: date,
      });
    });

    afterAll(() => client.close());

    it('should save and retrive date', async () => {
      const result = await client.selectFirst({
        select: field(Person, 'birthday'),
        from: table(Person),
      });
      expect(result).toEqual(date);
    });
  });
});
