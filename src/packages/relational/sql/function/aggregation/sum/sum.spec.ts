import { table } from '../../../keyword/table/table';
import { createMountain, createMountainTable } from '../../../../../../testing/schema/test-schema';
import { Mountain } from '../../../../../../docs/example/models/mountain';
import { sum } from './sum';
import { testClient } from '../../../../../../testing/relational/adapters';

describe('relational/sql/function/aggregation/sum', () => {
  const clients = testClient('pg', 'sqlite');

  describe.each(clients)('%s', (client) => {
    beforeAll(async () => {
      await createMountainTable(client);
      await createMountain(client, { prominence: 10 });
      await createMountain(client, { prominence: 20 });
    });

    afterAll(() => client.close());

    it('should get sum', async () => {
      const result = await client.selectFirst({
        select: sum(Mountain, 'prominence'),
        from: table(Mountain),
      });
      expect(result).toEqual(30);
    });
  });
});
