import { dataClients } from '../../../../../testing/relational/adapters';
import { ClientTestContext } from '../../../../../testing/relational/adapter/client-test-context';

describe('relational/sql/ddl/create-schema', () => {
  describe.each(dataClients)('%s', (ctxFactory) => {
    let ctx: ClientTestContext;

    beforeAll(async () => {
      ctx = await ctxFactory.getClient();
    });

    afterAll(() => ctx.close());

    it('should create schema', async () => {
      await ctx.client.exec({
        createSchema: 'auth',
      });
    });

    it('should create schema if not exists', async () => {
      await ctx.client.exec({
        createSchema: 'auth',
        ifNotExists: true,
      });
    });
  });
});
