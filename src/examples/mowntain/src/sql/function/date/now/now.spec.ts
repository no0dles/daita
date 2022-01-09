import { now } from '@daita/relational';
import { testContext } from '../../../../testing';

describe('relational/sql/function/date/now', () => {
  describe.each(testContext.contexts())('%s', (ctx) => {
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
