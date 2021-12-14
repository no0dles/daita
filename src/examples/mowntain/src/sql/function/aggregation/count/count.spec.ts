import { count, field, greaterThan, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { testContext } from '../../../../testing';

describe('relational/sql/function/aggregation/count', () => {
  const ctxs = testContext.contexts();

  describe.each(ctxs)('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
    });

    afterAll(async () => ctx.close());

    it('should count', async () => {
      const result = await ctx.selectFirst({
        select: count(),
        from: table(Mountain),
      });
      expect(result).toEqual(2);
    });

    it('should count with filter', async () => {
      const result = await ctx.selectFirst({
        select: count(),
        from: table(Mountain),
        where: greaterThan(field(Mountain, 'prominence'), 10),
      });
      expect(result).toEqual(2);
    });
  });
});
