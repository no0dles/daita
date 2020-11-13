import { table } from '../../../keyword/table/table';
import { dataClients } from '../../../../../../testing/relational/adapters';
import { createMountain, createMountainTable } from '../../../../../../testing/schema/test-schema';
import { Mountain } from '../../../../../../testing/schema/mountain';
import { sum } from './sum';
import { ClientTestContext } from '../../../../../../testing/relational/adapter/client-test-context';

describe('relational/sql/function/aggregation/sum', () => {
  describe.each(dataClients)('%s', (ctxFactory) => {
    let ctx: ClientTestContext;

    beforeAll(async () => {
      ctx = await ctxFactory.getClient();
      await createMountainTable(ctx.client);
      await createMountain(ctx.client, { prominence: 10 });
      await createMountain(ctx.client, { prominence: 20 });
    });

    afterAll(() => ctx.close());

    it('should get sum', async () => {
      const result = await ctx.client.selectFirst({
        select: sum(Mountain, 'prominence'),
        from: table(Mountain),
      });
      expect(result).toEqual(30);
    });
  });
});
