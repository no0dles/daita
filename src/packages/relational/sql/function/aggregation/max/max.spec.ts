import { table } from '../../../keyword/table/table';
import { dataClients, ClientTestContext } from '../../../../../../testing/relational/adapter-test';
import { createMountain, createMountainTable } from '../../../../../../testing/schema/test-schema';
import { Mountain } from '../../../../../../testing/schema/mountain';
import { max } from './max';

describe('relational/sql/function/aggregation/max', () => {
  describe.each(dataClients)('%s', (ctxFactory) => {
    let ctx: ClientTestContext;

    beforeAll(async () => {
      ctx = await ctxFactory.clientContext();
      await createMountainTable(ctx.client);
      await createMountain(ctx.client, { prominence: 10 });
      await createMountain(ctx.client, { prominence: 20 });
    });

    afterAll(() => ctx.close());

    it('should get max', async () => {
      const result = await ctx.client.selectFirst({
        select: max(Mountain, 'prominence'),
        from: table(Mountain),
      });
      expect(result).toEqual(20);
    });
  });
});
