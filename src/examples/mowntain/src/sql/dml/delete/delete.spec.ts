import { equal, field, table } from '@daita/relational';
import { AscentPerson } from '../../../models/ascent-person';
import { testContext } from '../../../testing';
import { Person } from '../../../models/person';

describe('delete', () => {
  describe.each(testContext.contexts())('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
    });

    afterAll(async () => ctx.close());

    it('should delete without conditions', async () => {
      const result = await ctx.delete({
        delete: table(AscentPerson),
      });
      expect(result.deletedRows).toEqual(1);
    });

    it('should delete with equal condition', async () => {
      const result = await ctx.delete({
        delete: table(Person),
        where: equal(field(Person, 'firstName'), 'Lucy'),
      });
      expect(result.deletedRows).toEqual(1);
    });
  });
});
