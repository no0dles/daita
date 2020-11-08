import { ClientTestContext, dataClients } from '../../../../../testing/relational/adapter-test';
import { createPerson, createPersonTable } from '../../../../../testing/schema/test-schema';

describe('relational/sql/ddl/create-table', () => {
  describe.each(dataClients)('%s', (ctxFactory) => {
    let ctx: ClientTestContext;

    beforeAll(async () => {
      ctx = await ctxFactory.clientContext();
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
