import { table } from '../../../keyword/table/table';
import { field } from '../../../keyword/field/field';
import { ClientTestContext, dataClients } from '../../../../../../testing/relational/adapter-test';

describe('relational/sql/ddl/alter-table/add-column', () => {
  describe.each(dataClients)('%s', (ctxFactory) => {
    let ctx: ClientTestContext;

    class TestTable {
      static table = 'test';
      id!: number;
      name!: string;
    }

    beforeAll(async () => {
      ctx = await ctxFactory.clientContext();
    });

    afterAll(() => ctx.close());

    it('should alter table', async () => {
      await ctx.client.exec({
        createTable: table(TestTable),
        columns: [{ name: 'id', notNull: true, primaryKey: true, type: 'number' }],
      });
      await ctx.client.exec({
        alterTable: table(TestTable),
        add: { column: 'name', type: 'string' },
      });
      await ctx.client.select({
        select: field(TestTable, 'name'),
        from: table(TestTable),
      });
    });
  });
});
