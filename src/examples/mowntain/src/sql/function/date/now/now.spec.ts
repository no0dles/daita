import { now } from '@daita/relational';
import { testContext } from '../../../../testing';

describe('relational/sql/function/date/now', () => {
  const ctxs = testContext.contexts();

  describe.each(ctxs)('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
    });

    afterAll(async () => ctx.close());

    it('should get now', async () => {
      const result = await ctx.selectFirst({
        select: {
          date: now(),
        },
      });
      expect(result).not.toBeNull();
      expect(result).not.toBeUndefined();
      expect(result!.date).toBeInstanceOf(Date);
    });
  });
});
