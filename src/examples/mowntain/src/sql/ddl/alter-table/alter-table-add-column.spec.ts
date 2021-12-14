import { table } from '@daita/relational';
import { testContext } from '../../../testing';
import { Person } from '../../../models/person';

describe('relational/sql/ddl/alter-table', () => {
  const ctxs = testContext.contexts();

  describe.each(ctxs)('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
    });

    afterAll(async () => ctx.close());

    it('should add column', async () => {
      await ctx.exec({
        alterTable: table(Person),
        add: {
          column: 'firstName2',
          type: 'string',
        },
      });
    });
  });
});
