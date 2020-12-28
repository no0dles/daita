import { Mountain } from '../../../../../../examples/mowntain/models/mountain';
import { testClient } from '../../../../../../testing/relational/adapters';
import { createMountain, createMountainTable } from '../../../../../../testing/schema/test-schema';
import { add } from './add';
import { field } from '../../../keyword/field/field';
import { table } from '../../../keyword/table/table';

describe('relational/sql/operands/add', () => {
  const clients = testClient('pg', 'sqlite', 'mariadb');

  describe.each(clients)('%s', (client) => {
    beforeAll(async () => {
      await createMountainTable(client);
      await createMountain(client, { prominence: 10 });
    });

    afterAll(() => client.close());

    it('should add field and value', async () => {
      const result = await client.selectFirst({
        select: add(field(Mountain, 'prominence'), 10),
        from: table(Mountain),
      });
      expect(result).toEqual(20);
    });

    it('should add value and value', async () => {
      const result = await client.selectFirst({
        select: add(10, 10),
        from: table(Mountain),
      });
      expect(result).toEqual(20);
    });
  });
});
