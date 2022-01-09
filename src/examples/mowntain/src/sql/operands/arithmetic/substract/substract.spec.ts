import { field, subtract, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { testContext } from '../../../../testing';

describe('relational/sql/operands/subtract', () => {
  describe.each(testContext.contexts())('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
    });

    afterAll(async () => ctx.close());

    it('should subtract value', async () => {
      const result = await ctx.selectFirst({
        select: subtract(field(Mountain, 'prominence'), 1037.501),
        from: table(Mountain),
      });
      expect(result).toEqual(5);
    });
  });
});
