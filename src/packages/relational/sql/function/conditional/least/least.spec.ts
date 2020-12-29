import { table } from '../../../keyword/table/table';
import { createMountain, createMountainTable } from '../../../../../../testing/schema/test-schema';
import { Mountain } from '../../../../../../examples/mowntain/models/mountain';
import { testClient } from '../../../../../../testing/relational/adapters';
import { field } from '../../../keyword/field/field';
import { least } from './least';

describe('relational/sql/function/number/least', () => {
  const clients = testClient('pg', 'sqlite', 'mariadb');

  describe.each(clients)('%s', (client) => {
    beforeAll(async () => {
      await createMountainTable(client);
      await createMountain(client, { prominence: 10 });
    });

    afterAll(() => client.close());

    it('should get from field and value', async () => {
      const result = await client.selectFirst({
        select: least(field(Mountain, 'prominence'), 20),
        from: table(Mountain),
      });
      expect(result).toEqual(10);
    });

    it('should get null and value', async () => {
      const result = await client.selectFirst({
        select: least(field(Mountain, 'ascents'), 20),
        from: table(Mountain),
      });
      expect(result).toEqual(20);
    });

    it('should get value and null', async () => {
      const result = await client.selectFirst({
        select: least(20, field(Mountain, 'ascents')),
        from: table(Mountain),
      });
      expect(result).toEqual(20);
    });

    it('should get null and null', async () => {
      const result = await client.selectFirst({
        select: least(field(Mountain, 'ascents'), field(Mountain, 'ascents')),
        from: table(Mountain),
      });
      expect(result).toEqual(null);
    });
  });
});
