import { testContext } from '../../../testing';
import { Mountain } from '../../../models/mountain';
import { count, equal, field, greaterThan, join, table } from '@daita/relational';
import { Canton } from '../../../models/canton';

describe('docs/example/sql/dml/select', () => {
  const ctxs = testContext.contexts();

  describe.each(ctxs)('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
    });

    afterAll(async () => ctx.close());

    it('should select group by disabled and select count', async () => {
      const result = await ctx.select({
        select: {
          name: field(Canton, 'name'),
          count: count(),
        },
        from: table(Canton),
        join: [join(Mountain, equal(field(Mountain, 'cantonShortname'), field(Canton, 'shortname')))],
        groupBy: field(Canton, 'name'),
        orderBy: [count(), field(Canton, 'name')],
      });

      expect(result).toEqual([
        {
          count: 1,
          name: 'Bern',
        },
        {
          count: 1,
          name: 'Valais',
        },
      ]);
    });

    it('should select group by with having', async () => {
      const result = await ctx.select({
        select: {
          name: field(Canton, 'name'),
          count: count(),
        },
        from: table(Canton),
        join: [join(Mountain, equal(field(Mountain, 'cantonShortname'), field(Canton, 'shortname')))],
        groupBy: field(Canton, 'name'),
        having: greaterThan(count(), 1),
        orderBy: [count(), field(Canton, 'name')],
      });
      expect(result).toEqual([]);
    });
  });
});
