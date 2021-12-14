import { concat, field, table } from '@daita/relational';
import { testContext } from '../../../../testing';
import { Person } from '../../../../models/person';

describe('relational/sql/function/string/concat', () => {
  const ctxs = testContext.contexts();

  describe.each(ctxs)('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
    });

    afterAll(async () => ctx.close());

    it('should concat fields', async () => {
      const result = await ctx.selectFirst({
        select: {
          name: concat(field(Person, 'firstName'), field(Person, 'lastName')),
        },
        from: table(Person),
      });
      expect(result).toEqual({ name: 'EdwardWhymper' });
    });

    it('should concat values and fields', async () => {
      const result = await ctx.selectFirst({
        select: {
          name: concat('Foo ', field(Person, 'lastName')),
        },
        from: table(Person),
      });
      expect(result).toEqual({ name: 'Foo Whymper' });
    });
  });
});
