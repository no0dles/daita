import { testContext } from '../../../testing';
import { Ascent } from '../../../models/ascent';
import { field, table } from '@daita/relational';

describe('relational/types/date', () => {
  const ctxs = testContext.contexts();

  describe.each(ctxs)('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
    });

    afterAll(async () => ctx.close());

    it('should save and retrive date', async () => {
      const result = await ctx.selectFirst({
        select: field(Ascent, 'date'),
        from: table(Ascent),
      });
      expect(result).toEqual(new Date(Date.UTC(2021, 0, 2, 12, 22, 33)));
    });
  });
});
