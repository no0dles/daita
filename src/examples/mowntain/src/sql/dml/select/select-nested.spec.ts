import { testContext } from '../../../testing';
import { field, table } from '@daita/relational';
import { Mountain } from '../../../models/mountain';

describe('docs/example/sql/dml/select', () => {
  const ctxs = testContext.contexts();

  describe.each(ctxs)('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
    });

    afterAll(async () => ctx.close());

    it('should return nested fields', async () => {
      const result = await ctx.select({
        select: {
          data: {
            prominence: field(Mountain, 'prominence'),
            elevation: field(Mountain, 'elevation'),
          },
          name: field(Mountain, 'name'),
        },
        from: table(Mountain),
        orderBy: field(Mountain, 'prominence'),
      });
      expect(result).toEqual([
        { data: { prominence: 695, elevation: 4158 }, name: 'Jungfrau' },
        {
          data: { prominence: 1042.501, elevation: 4478 },
          name: 'Matterhorn',
        },
      ]);
    });
  });
});
