import { Mountain } from '../../../models/mountain';
import { field, table } from '../../../../../packages/relational';
import { testContext } from '../../../../../testing/relational/adapters';
import { schema } from '../../../schema';

describe('docs/example/sql/dml/select', () => {
  const clients = testContext(schema, 'pg', 'sqlite');

  describe.each(clients)('%s', (ctx) => {
    beforeAll(async () => ctx.migrate());
    afterAll(async () => ctx.close());

    it('should select Mountain.name, Mountain.prominence from Mountain', async () => {
      await ctx.select({
        select: {
          name: field(Mountain, 'name'),
          prominence: field(Mountain, 'prominence'),
        },
        from: table(Mountain),
      });
    });
  });
});
