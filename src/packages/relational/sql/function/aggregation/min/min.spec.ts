import { table } from '../../../keyword/table/table';
import { dataClients } from '../../../../../../testing/relational/adapters';
import { createMountain, createMountainTable } from '../../../../../../testing/schema/test-schema';
import { Mountain } from '../../../../../../testing/schema/mountain';
import { min } from './min';
import { ClientTestContext } from '../../../../../../testing/relational/adapter/client-test-context';

describe('relational/sql/function/aggregation/min', () => {
  describe.each(dataClients)('%s', (ctxFactory) => {
    let ctx: ClientTestContext;

    beforeAll(async () => {
      ctx = await ctxFactory.getClient();
      await createMountainTable(ctx.client);
      await createMountain(ctx.client, { prominence: 10 });
      await createMountain(ctx.client, { prominence: 20 });
    });

    afterAll(() => ctx.close());

    it('should get min', async () => {
      const result = await ctx.client.selectFirst({
        select: min(Mountain, 'prominence'),
        from: table(Mountain),
      });
      expect(result).toEqual(10);
    });
  });
});
