import { table } from '@daita/relational';
import { testContext } from '../../../testing';
import { Person } from '../../../models/person';

describe('relational/sql/ddl/alter-table', () => {
  const ctxs = testContext.contexts({
    alterTable: table(Person),
    drop: {
      column: 'firstName',
    },
  });

  describe.each(ctxs)('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
    });

    afterAll(async () => ctx.close());

    it('should drop column', async () => {
      await ctx.exec({
        alterTable: table(Person),
        drop: {
          column: 'firstName',
        },
      });
    });
  });
});
