import { CreateTableSql, table } from '@daita/relational';
import { testContext } from '../../../testing';

describe('relational/sql/ddl/create-table', () => {
  const ctxs = testContext.contexts();

  describe.each(ctxs)('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup();
    });

    afterAll(async () => ctx.close());

    it('should create person table', async () => {
      await ctx.exec({
        createTable: table('foo'),
        columns: [
          {
            name: 'id',
            notNull: false,
            primaryKey: true,
            type: 'number',
          },
        ],
      } as CreateTableSql);
    });
  });
});
