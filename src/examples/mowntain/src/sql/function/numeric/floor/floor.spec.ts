import { field, floor, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { testContext } from '../../../../testing';

describe('relational/sql/function/number/floor', () => {
  describe.each(testContext.contexts())('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
    });

    afterAll(async () => ctx.close());

    it('should get from field and value', async () => {
      const result = await ctx.selectFirst({
        select: floor(field(Mountain, 'prominence')),
        from: table(Mountain),
      });
      expect(result).toEqual(1042);
    });

    it('should get null and value', async () => {
      const result = await ctx.selectFirst({
        select: floor(field(Mountain, 'ascents')),
        from: table(Mountain),
      });
      expect(result).toEqual(null);
    });
  });
});
