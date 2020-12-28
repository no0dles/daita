import { field } from '../../../keyword/field/field';
import { Mountain } from '../../../../../../examples/mowntain/models/mountain';
import { testClient } from '../../../../../../testing/relational/adapters';
import { createMountain, createMountainTable } from '../../../../../../testing/schema/test-schema';
import { table } from '../../../keyword/table/table';
import { divide } from './divide';

describe('relational/sql/operands/divide', () => {
  const clients = testClient('pg', 'sqlite', 'mariadb');

  describe.each(clients)('%s', (client) => {
    beforeAll(async () => {
      await createMountainTable(client);
      await createMountain(client, { prominence: 10 });
    });

    afterAll(() => client.close());

    it('should divide value and field', async () => {
      const result = await client.selectFirst({
        select: divide(field(Mountain, 'prominence'), 5),
        from: table(Mountain),
      });
      expect(result).toEqual(2);
    });
  });
});
