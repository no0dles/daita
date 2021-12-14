import { max, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { testContext } from '../../../../testing';

describe('relational/sql/function/aggregation/max', () => {
  const ctxs = testContext.contexts();

  describe.each(ctxs)('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
    });

    afterAll(async () => ctx.close());

    it('should get max', async () => {
      const result = await ctx.selectFirst({
        select: max(Mountain, 'prominence'),
        from: table(Mountain),
      });
      expect(result).toEqual(1042.501);
    });
  });
});
