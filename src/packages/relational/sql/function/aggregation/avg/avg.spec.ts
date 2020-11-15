import { table } from '../../../keyword/table/table';
import { testClient } from '../../../../../../testing/relational/adapters';
import { createMountain, createMountainTable } from '../../../../../../testing/schema/test-schema';
import { avg } from './avg';
import { Mountain } from '../../../../../../testing/schema/mountain';

describe('relational/sql/function/aggregation/avg', () => {
  const clients = testClient('pg', 'sqlite');

  describe.each(clients)('%s', (client) => {
    beforeAll(async () => {
      await createMountainTable(client);
      await createMountain(client, { prominence: 10 });
      await createMountain(client, { prominence: 20 });
    });

    afterAll(() => client.close());

    it('should avg date', async () => {
      const result = await client.selectFirst({
        select: avg(Mountain, 'prominence'),
        from: table(Mountain),
      });
      expect(result).toEqual(15);
    });
  });
});
