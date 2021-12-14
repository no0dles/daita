import { min, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { testContext } from '../../../../testing';

describe('relational/sql/function/aggregation/min', () => {
  const ctxs = testContext.contexts();

  describe.each(ctxs)('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
    });

    afterAll(async () => ctx.close());

    it('should get min', async () => {
      const result = await ctx.selectFirst({
        select: min(Mountain, 'prominence'),
        from: table(Mountain),
      });
      expect(result).toEqual(695);
    });
  });
});
