import { field } from '../../../keyword/field/field';
import { Mountain } from '../../../../../../examples/mowntain/models/mountain';
import { testClient } from '../../../../../../testing/relational/adapters';
import { createMountain, createMountainTable } from '../../../../../../testing/schema/test-schema';
import { subtract } from './subtract';
import { table } from '../../../keyword/table/table';

describe('relational/sql/operands/subtract', () => {
  const clients = testClient('pg', 'sqlite', 'mariadb');

  describe.each(clients)('%s', (client) => {
    beforeAll(async () => {
      await createMountainTable(client);
      await createMountain(client, { prominence: 10 });
    });

    afterAll(() => client.close());

    it('should subtract value', async () => {
      const result = await client.selectFirst({
        select: subtract(field(Mountain, 'prominence'), 5),
        from: table(Mountain),
      });
      expect(result).toEqual(5);
    });
  });
});
