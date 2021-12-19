import { ceil, field, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { testContext } from '../../../../testing';

describe('relational/sql/function/number/least', () => {
  const ctxs = testContext.contexts();

  describe.each(ctxs)('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
    });

    afterAll(async () => ctx.close());

    it('should get from field and value', async () => {
      const result = await ctx.selectFirst({
        select: ceil(field(Mountain, 'prominence')),
        from: table(Mountain),
      });
      expect(result).toEqual(1043);
    });

    it('should get null if value is null', async () => {
      const result = await ctx.selectFirst({
        select: ceil(field(Mountain, 'ascents')),
        from: table(Mountain),
      });
      expect(result).toEqual(null);
    });
  });
});
