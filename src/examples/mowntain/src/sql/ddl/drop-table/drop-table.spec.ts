import { AscentPerson } from '../../../models/ascent-person';
import { testContext } from '../../../testing';
import { table } from '@daita/relational';

describe('relational/sql/ddl/drop-table', () => {
  describe.each(testContext.contexts())('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
    });

    afterAll(async () => ctx.close());

    it('should create person table', async () => {
      await ctx.exec({
        dropTable: table(AscentPerson),
      });
    });

    it('should create person table if exists', async () => {
      await ctx.exec({
        dropTable: table(AscentPerson),
        ifExists: true,
      });
    });
  });
});
