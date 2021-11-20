import { testClient } from '../../../../../../testing/relational/adapters';
import { createMountain, createMountainTable } from '../../../../../../testing/schema/test-schema';
import { max } from '../../../function/aggregation/max/max';
import { Mountain } from '../../../../../../examples/mowntain/models/mountain';
import { table } from '../../../keyword/table/table';
import { field } from '../../../keyword/field/field';
import { subSelect } from './sub-select';
import { alias } from '../../../keyword/alias/alias';

describe('relational/sql/dml/select/subquery', () => {
  const clients = testClient('pg', 'sqlite', 'mariadb');

  describe.each(clients)('%s', (client) => {
    beforeAll(async () => {
      await createMountainTable(client);
      await createMountain(client, { prominence: 10 });
      await createMountain(client, { prominence: 20 });
    });

    afterAll(() => client.close());

    it('should allow max with alias', async () => {
      const mountains = await client.select({
        select: {
          prominence: field(Mountain, 'prominence'),
          otherHighestProminence: subSelect({
            select: max(alias(Mountain, 'other'), 'prominence'),
            from: alias(Mountain, 'other'),
          }),
        },
        from: table(Mountain),
        orderBy: field(Mountain, 'prominence'),
      });
      expect(mountains).toEqual([
        { prominence: 10, otherHighestProminence: 20 },
        { prominence: 20, otherHighestProminence: 10 },
      ]);
    });
  });
});
