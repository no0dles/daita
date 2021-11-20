import { table } from '../../../keyword/table/table';
import { createMountain, createMountainTable } from '../../../../../../testing/schema/test-schema';
import { Mountain } from '../../../../../../examples/mowntain/models/mountain';
import { greatest } from './greatest';
import { testClient } from '../../../../../../testing/relational/adapters';
import { field } from '../../../keyword/field/field';

describe('relational/sql/function/number/greatest', () => {
  const clients = testClient('pg', 'sqlite', 'mariadb');

  describe.each(clients)('%s', (client) => {
    beforeAll(async () => {
      await createMountainTable(client);
      await createMountain(client, { prominence: 10 });
    });

    afterAll(() => client.close());

    it('should get greatest from value and value', async () => {
      const result = await client.selectFirst({
        select: greatest(10, 20),
        from: table(Mountain),
      });
      expect(result).toEqual(20);
    });

    it('should get greatest from field and value', async () => {
      const result = await client.selectFirst({
        select: greatest(field(Mountain, 'prominence'), 20),
        from: table(Mountain),
      });
      expect(result).toEqual(20);
    });

    it('should get greatest nullable field and value', async () => {
      const result = await client.selectFirst({
        select: greatest(field(Mountain, 'ascents'), 20),
        from: table(Mountain),
      });
      expect(result).toEqual(20);
    });

    it('should get greatest value and nullable field', async () => {
      const result = await client.selectFirst({
        select: greatest(20, field(Mountain, 'ascents')),
        from: table(Mountain),
      });
      expect(result).toEqual(20);
    });

    it('should get greatest of two nullable fields', async () => {
      const result = await client.selectFirst({
        select: greatest(field(Mountain, 'ascents'), field(Mountain, 'ascents')),
        from: table(Mountain),
      });
      expect(result).toEqual(null);
    });
  });
});
