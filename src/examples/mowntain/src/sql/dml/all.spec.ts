import { testContext } from '../../testing';
import { all, table } from '@daita/relational';
import { Person } from '../../models/person';

describe('relational/sql/keyword/all', () => {
  const ctxs = testContext.contexts();

  describe.each(ctxs)('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
    });

    afterAll(async () => ctx.close());

    it('should select all fields', async () => {
      const result = await ctx.selectFirst({
        select: all(),
        from: table(Person),
      });
      expect(result).toEqual({
        active: false,
        birthday: new Date(Date.UTC(1840, 3, 27)),
        firstName: 'Edward',
        id: '571cb303-bd0f-40a3-8404-9395471d03e3',
        lastName: 'Whymper',
      });
    });

    it('should select all fields from table', async () => {
      const result = await ctx.selectFirst({
        select: all(Person),
        from: table(Person),
      });
      expect(result).toEqual({
        active: false,
        birthday: new Date(Date.UTC(1840, 3, 27)),
        firstName: 'Edward',
        id: '571cb303-bd0f-40a3-8404-9395471d03e3',
        lastName: 'Whymper',
      });
    });
  });
});
