import { table } from '../../../keyword/table/table';
import { testClient } from '../../../../../../testing/relational/adapters';
import { createMountain, createMountainTable } from '../../../../../../testing/schema/test-schema';
import { Mountain } from '../../../../../../docs/example/models/mountain';
import { count } from './count';
import { greaterThan } from '../../../operands/comparison/greater-than/greater-than';
import { field } from '../../../keyword/field/field';

describe('relational/sql/function/aggregation/count', () => {
  const clients = testClient('pg', 'sqlite', 'mariadb');

  describe.each(clients)('%s', (client) => {
    beforeAll(async () => {
      await createMountainTable(client);
      await createMountain(client, { prominence: 10 });
      await createMountain(client, { prominence: 20 });
    });

    afterAll(() => client.close());

    it('should count', async () => {
      const result = await client.selectFirst({
        select: count(),
        from: table(Mountain),
      });
      expect(result).toEqual(2);
    });

    it('should count with filter', async () => {
      const result = await client.selectFirst({
        select: count(),
        from: table(Mountain),
        where: greaterThan(field(Mountain, 'prominence'), 10),
      });
      expect(result).toEqual(1);
    });
  });
});
