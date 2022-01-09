import { avg, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { testContext } from '../../../../testing';

describe('relational/sql/function/aggregation/avg', () => {
  describe.each(testContext.contexts())('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
    });

    afterAll(async () => ctx.close());

    it('should avg date', async () => {
      const result = await ctx.selectFirst({
        select: avg(Mountain, 'prominence'),
        from: table(Mountain),
      });
      expect(result).toEqual(868.7505);
    });
  });
});
