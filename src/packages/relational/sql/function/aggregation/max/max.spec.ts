import { table } from '../../../keyword/table/table';
import { testClient } from '../../../../../../testing/relational/adapters';
import { createMountain, createMountainTable } from '../../../../../../testing/schema/test-schema';
import { Mountain } from '../../../../../../docs/example/models/mountain';
import { max } from './max';

describe('relational/sql/function/aggregation/max', () => {
  const clients = testClient('pg', 'sqlite', 'mariadb');

  describe.each(clients)('%s', (client) => {
    beforeAll(async () => {
      await createMountainTable(client);
      await createMountain(client, { prominence: 10 });
      await createMountain(client, { prominence: 20 });
    });

    afterAll(() => client.close());

    it('should get max', async () => {
      const result = await client.selectFirst({
        select: max(Mountain, 'prominence'),
        from: table(Mountain),
      });
      expect(result).toEqual(20);
    });
  });
});
