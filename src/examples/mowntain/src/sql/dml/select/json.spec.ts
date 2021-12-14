import { testContext } from '../../../testing';
import { equal, field, table } from '@daita/relational';
import { Mountain } from '../../../models/mountain';

describe('relational/types/sql', () => {
  const ctxs = testContext.contexts();

  describe.each(ctxs)('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
    });

    afterAll(async () => ctx.close());

    it('should save and retrive json', async () => {
      const result = await ctx.selectFirst({
        select: field(Mountain, 'extra'),
        from: table(Mountain),
        where: equal(field(Mountain, 'id'), 'b04a54c9-6aa8-4e31-8c99-3db03342ea70'),
      });
      expect(result).toEqual({ bool: true, text: 'foo', value: 10, date: new Date(2021, 0, 2) });
    });
  });
});
