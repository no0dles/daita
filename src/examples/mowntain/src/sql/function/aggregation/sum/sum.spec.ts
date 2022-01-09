import { sum, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { testContext } from '../../../../testing';

describe('relational/sql/function/aggregation/sum', () => {
  describe.each(testContext.contexts())('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
    });

    afterAll(async () => ctx.close());

    it('should get sum', async () => {
      const result = await ctx.selectFirst({
        select: sum(Mountain, 'prominence'),
        from: table(Mountain),
      });
      expect(result).toEqual(1737.501);
    });
  });
});
