import { testContext } from '../../../testing';

describe('sql/dml/select/variables', () => {
  describe.each(testContext.contexts())('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
    });

    afterAll(async () => ctx.close());

    it('should select 1', async () => {
      const result = await ctx.selectFirst({ select: 1 });
      expect(result).toEqual(1);
    });
  });
});
