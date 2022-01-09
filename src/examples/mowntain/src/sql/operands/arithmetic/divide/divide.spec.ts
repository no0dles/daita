import { divide, field, table } from '@daita/relational';
import { Mountain } from '../../../../models/mountain';
import { testContext } from '../../../../testing';

describe('relational/sql/operands/divide', () => {
  describe.each(testContext.contexts())('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
    });

    afterAll(async () => ctx.close());

    it('should divide value and field', async () => {
      const result = await ctx.selectFirst({
        select: divide(field(Mountain, 'prominence'), 5),
        from: table(Mountain),
      });
      expect(result).toEqual(208.5002);
    });
  });
});
