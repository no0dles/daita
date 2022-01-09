import { field, least, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { testContext } from '../../../../testing';

describe('relational/sql/function/number/least', () => {
  describe.each(testContext.contexts())('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
    });

    afterAll(async () => ctx.close());

    it('should get from field and value', async () => {
      const result = await ctx.selectFirst({
        select: least(field(Mountain, 'prominence'), 20),
        from: table(Mountain),
      });
      expect(result).toEqual(20);
    });

    it('should get null and value', async () => {
      const result = await ctx.selectFirst({
        select: least(field(Mountain, 'ascents'), 20),
        from: table(Mountain),
      });
      expect(result).toEqual(20);
    });

    it('should get value and null', async () => {
      const result = await ctx.selectFirst({
        select: least(20, field(Mountain, 'ascents')),
        from: table(Mountain),
      });
      expect(result).toEqual(20);
    });

    it('should get null and null', async () => {
      const result = await ctx.selectFirst({
        select: least(field(Mountain, 'ascents'), field(Mountain, 'ascents')),
        from: table(Mountain),
      });
      expect(result).toEqual(null);
    });
  });
});
