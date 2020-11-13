import { dataClients } from '../../../../../testing/relational/adapters';
import { createPerson, createPersonTable } from '../../../../../testing/schema/test-schema';
import { ClientTestContext } from '../../../../../testing/relational/adapter/client-test-context';

describe('relational/sql/ddl/create-table', () => {
  describe.each(dataClients)('%s', (ctxFactory) => {
    let ctx: ClientTestContext;

    beforeAll(async () => {
      ctx = await ctxFactory.getClient();
    });

    afterAll(() => ctx.close());

    it('should create person table', async () => {
      await createPersonTable(ctx.client);
      await createPerson(ctx.client, {
        id: 'a',
        firstName: 'Foo',
        lastName: 'Bar',
      });
    });
  });
});
