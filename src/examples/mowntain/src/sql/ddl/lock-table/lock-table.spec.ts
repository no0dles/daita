import { table } from '@daita/relational';
import { testContext } from '../../../testing';
import { Person } from '../../../models/person';

describe('relational/sql/ddl/lock-table', () => {
  const ctxs = testContext.contexts({ lockTable: table(Person) });

  describe.each(ctxs)('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
    });

    afterAll(async () => ctx.close());

    it('should lock person table', async () => {
      await ctx.transaction(async (trx) => {
        await trx.exec({
          lockTable: table(Person),
        });
      });
    });
  });
});
