import { field, multiply, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { testContext } from '../../../../testing';

describe('relational/sql/operands/multiply', () => {
  describe.each(testContext.contexts())('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
    });

    afterAll(async () => ctx.close());

    it('should multiply value and field', async () => {
      const result = await ctx.selectFirst({
        select: multiply(field(Mountain, 'prominence'), 5),
        from: table(Mountain),
      });
      expect(result).toEqual(5212.505);
    });
  });
});
