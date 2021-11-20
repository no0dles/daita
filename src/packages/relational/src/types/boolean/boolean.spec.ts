import { field } from '../../sql/keyword/field/field';
import { testClient } from '../../../../testing/relational/adapters';
import { createPerson, createPersonTable } from '../../../../testing/schema/test-schema';
import { table } from '../../sql/keyword/table/table';
import { Person } from '../../../../examples/mowntain/models/person';
import { randomUuid } from '@daita/common/utils/random-string';
import { equal } from '../../sql/operands/comparison/equal/equal';

describe('relational/types/booean', () => {
  const clients = testClient('pg', 'sqlite', 'mariadb');
  const falseId = randomUuid();
  const trueId = randomUuid();

  describe.each(clients)('%s', (client) => {
    beforeAll(async () => {
      await createPersonTable(client);
      await createPerson(client, {
        id: falseId,
        active: false,
      });
      await createPerson(client, {
        id: trueId,
        active: true,
      });
    });

    afterAll(() => client.close());

    it('should save and retrive boolean false value', async () => {
      const result = await client.selectFirst({
        select: field(Person, 'active'),
        from: table(Person),
        where: equal(field(Person, 'id'), falseId),
      });
      expect(result).toEqual(false);
    });

    it('should save and retrive boolean true value', async () => {
      const result = await client.selectFirst({
        select: field(Person, 'active'),
        from: table(Person),
        where: equal(field(Person, 'id'), trueId),
      });
      expect(result).toEqual(true);
    });
  });
});
