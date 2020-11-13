import { table } from '../../keyword/table/table';
import { dataClients } from '../../../../../testing/relational/adapters';
import { ClientTestContext } from '../../../../../testing/relational/adapter/client-test-context';
import { createPersonTable } from '../../../../../testing/schema/test-schema';
import { Person } from '../../../../../testing/schema/person';

describe('relational/sql/ddl/drop-table', () => {
  describe.each(dataClients)('%s', (ctxFactory) => {
    let ctx: ClientTestContext;

    beforeAll(async () => {
      ctx = await ctxFactory.getClient();
      await createPersonTable(ctx.client);
    });

    afterAll(() => ctx.close());

    it('should create person table', async () => {
      await ctx.client.exec({
        dropTable: table(Person),
      });
    });

    it('should create person table if exists', async () => {
      await ctx.client.exec({
        dropTable: table(Person),
        ifExists: true,
      });
    });
  });
});
