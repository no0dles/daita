import { field } from '../../sql/keyword/field/field';
import { Mountain } from '../../../../examples/mowntain/models/mountain';
import { testClient } from '../../../../testing/relational/adapters';
import { createMountain, createMountainTable } from '../../../../testing/schema/test-schema';
import { table } from '../../sql/keyword/table/table';
import { json } from './json';

describe('relational/types/sql', () => {
  const clients = testClient('pg'); //, 'sqlite', 'mariadb'
  const jsonValue = { bool: true, text: 'foo', value: 10, date: new Date() };

  describe.each(clients)('%s', (client) => {
    beforeAll(async () => {
      await createMountainTable(client);
      await createMountain(client, { extra: json(jsonValue) });
    });

    afterAll(() => client.close());

    it('should save and retrive json', async () => {
      const result = await client.selectFirst({
        select: field(Mountain, 'extra'),
        from: table(Mountain),
      });
      expect(result).toEqual(jsonValue);
    });

    it('should retrive nested json', async () => {
      const result = await client.selectFirst({
        select: field(Mountain, (e) => e.extra.value),
        from: table(Mountain),
      });
      expect(result).toEqual('10');
    });
  });
});
