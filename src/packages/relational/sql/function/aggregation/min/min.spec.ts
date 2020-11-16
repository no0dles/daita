import { table } from '../../../keyword/table/table';
import { testClient } from '../../../../../../testing/relational/adapters';
import { createMountain, createMountainTable } from '../../../../../../testing/schema/test-schema';
import { Mountain } from '../../../../../../docs/example/models/mountain';
import { min } from './min';

describe('relational/sql/function/aggregation/min', () => {
  const clients = testClient('pg', 'sqlite');

  describe.each(clients)('%s', (client) => {
    beforeAll(async () => {
      await createMountainTable(client);
      await createMountain(client, { prominence: 10 });
      await createMountain(client, { prominence: 20 });
    });

    afterAll(() => client.close());

    it('should get min', async () => {
      const result = await client.selectFirst({
        select: min(Mountain, 'prominence'),
        from: table(Mountain),
      });
      expect(result).toEqual(10);
    });
  });
});
