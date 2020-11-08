import { table } from '../../../keyword/table/table';
import { dataClients, ClientTestContext } from '../../../../../../testing/relational/adapter-test';
import { createMountain, createMountainTable } from '../../../../../../testing/schema/test-schema';
import { Mountain } from '../../../../../../testing/schema/mountain';
import { count } from './count';
import { greaterThan } from '../../../operands/comparison/greater-than/greater-than';
import { field } from '../../../keyword/field/field';

describe('relational/sql/function/aggregation/count', () => {
  describe.each(dataClients)('%s', (ctxFactory) => {
    let ctx: ClientTestContext;

    beforeAll(async () => {
      ctx = await ctxFactory.clientContext();
      await createMountainTable(ctx.client);
      await createMountain(ctx.client, { prominence: 10 });
      await createMountain(ctx.client, { prominence: 20 });
    });

    afterAll(() => ctx.close());

    it('should count', async () => {
      const result = await ctx.client.selectFirst({
        select: count(),
        from: table(Mountain),
      });
      expect(result).toEqual(2);
    });

    it('should count with filter', async () => {
      const result = await ctx.client.selectFirst({
        select: count(),
        from: table(Mountain),
        where: greaterThan(field(Mountain, 'prominence'), 10),
      });
      expect(result).toEqual(1);
    });
  });
});
