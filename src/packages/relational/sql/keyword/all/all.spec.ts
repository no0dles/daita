import { all } from './all';
import { table } from '../table/table';
import { createPerson, createPersonTable } from '../../../../../testing/schema/test-schema';
import { dataClients } from '../../../../../testing/relational/adapters';
import { Person } from '../../../../../testing/schema/person';
import { ClientTestContext } from '../../../../../testing/relational/adapter/client-test-context';

describe('relational/sql/keyword/all', () => {
  describe.each(dataClients)('%s', (ctxFactory) => {
    let ctx: ClientTestContext;

    beforeAll(async () => {
      ctx = await ctxFactory.getClient();
      await createPersonTable(ctx.client);
      await createPerson(ctx.client, { firstName: 'Foo', lastName: 'Bar', id: 'a' });
    });

    afterAll(() => ctx.close());

    it('should select all fields', async () => {
      const result = await ctx.client.selectFirst({
        select: all(),
        from: table(Person),
      });
      expect(result).toEqual({ firstName: 'Foo', lastName: 'Bar', id: 'a', birthday: null });
    });

    it('should select all fields from table', async () => {
      const result = await ctx.client.selectFirst({
        select: all(Person),
        from: table(Person),
      });
      expect(result).toEqual({ firstName: 'Foo', lastName: 'Bar', id: 'a', birthday: null });
    });
  });
});
