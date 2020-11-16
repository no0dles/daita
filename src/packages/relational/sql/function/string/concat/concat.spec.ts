import { concat } from './concat';
import { field } from '../../../keyword/field/field';
import { table } from '../../../keyword/table/table';
import { Person } from '../../../../../../docs/example/models/person';
import { createPerson, createPersonTable } from '../../../../../../testing/schema/test-schema';
import { testClient } from '../../../../../../testing/relational/adapters';

describe('relational/sql/function/string/concat', () => {
  const clients = testClient('pg', 'sqlite');

  describe.each(clients)('%s', (client) => {
    beforeAll(async () => {
      await createPersonTable(client);
      await createPerson(client, { firstName: 'Foo', lastName: 'Bar' });
    });

    afterAll(() => client.close());

    it('should concat fields', async () => {
      const result = await client.selectFirst({
        select: {
          name: concat(field(Person, 'firstName'), field(Person, 'lastName')),
        },
        from: table(Person),
      });
      expect(result).toEqual({ name: 'FooBar' });
    });

    it('should concat values and fields', async () => {
      const result = await client.selectFirst({
        select: {
          name: concat('Foo ', field(Person, 'lastName')),
        },
        from: table(Person),
      });
      expect(result).toEqual({ name: 'Foo Bar' });
    });
  });
});
