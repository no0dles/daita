import { testContext } from '../../../testing';
import { and, desc, equal, field, isIn, min, notEqual, table } from '@daita/relational';
import { Mountain } from '../../../models/mountain';

describe('docs/example/sql/dml/select', () => {
  describe.each(testContext.contexts())('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
    });

    afterAll(async () => ctx.close());

    // TODO postgres = '1', sqlite = 1
    // it('should select 1', async () => {
    //   const result = await ctx.select({
    //     select: 1,
    //   });
    //   expect(result).toEqual([1]);
    // });

    it('should select min(Mountain, elevation)', async () => {
      const result = await ctx.selectFirst({
        select: min(Mountain, 'elevation'),
        from: table(Mountain),
      });
      expect(result).toEqual(4158);
    });

    it('should select field(Mountain, name)', async () => {
      const result = await ctx.selectFirst({
        select: field(Mountain, 'name'),
        from: table(Mountain),
        where: equal(field(Mountain, 'id'), 'b04a54c9-6aa8-4e31-8c99-3db03342ea70'),
      });
      expect(result).toEqual('Jungfrau');
    });

    it('should select offset 1', async () => {
      const result = await ctx.selectFirst({
        select: field(Mountain, 'name'),
        from: table(Mountain),
        offset: 1,
        orderBy: field(Mountain, 'prominence'),
      });
      expect(result).toEqual('Matterhorn');
    });

    it('should select notEqual', async () => {
      const result = await ctx.selectFirst({
        select: field(Mountain, 'name'),
        from: table(Mountain),
        where: notEqual(field(Mountain, 'name'), 'Matterhorn'),
      });
      expect(result).toEqual('Jungfrau');
    });

    it('should select and', async () => {
      const result = await ctx.selectFirst({
        select: field(Mountain, 'name'),
        from: table(Mountain),
        where: and(notEqual(field(Mountain, 'name'), 'Matterhorn'), equal(field(Mountain, 'name'), 'Jungfrau')),
      });
      expect(result).toEqual('Jungfrau');
    });

    it('should select in', async () => {
      const result = await ctx.select({
        select: field(Mountain, 'name'),
        from: table(Mountain),
        where: isIn(field(Mountain, 'name'), ['Matterhorn', 'Jungfrau']),
        orderBy: field(Mountain, 'name'),
      });
      expect(result).toEqual(['Jungfrau', 'Matterhorn']);
    });

    it('should select order desc', async () => {
      const result = await ctx.select({
        select: field(Mountain, 'name'),
        from: table(Mountain),
        orderBy: desc(field(Mountain, 'name')),
      });
      expect(result).toEqual(['Matterhorn', 'Jungfrau']);
    });
  });
});
