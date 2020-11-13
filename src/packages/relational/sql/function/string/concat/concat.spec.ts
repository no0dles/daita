import { concat } from './concat';
import { field } from '../../../keyword/field/field';
import { table } from '../../../keyword/table/table';
import { Person } from '../../../../../../testing/schema/person';
import { dataClients } from '../../../../../../testing/relational/adapters';
import { createPerson, createPersonTable } from '../../../../../../testing/schema/test-schema';
import { ClientTestContext } from '../../../../../../testing/relational/adapter/client-test-context';

describe('relational/sql/function/string/concat', () => {
  describe.each(dataClients)('%s', (ctxFactory) => {
    let ctx: ClientTestContext;

    beforeAll(async () => {
      ctx = await ctxFactory.getClient();
      await createPersonTable(ctx.client);
      await createPerson(ctx.client, { firstName: 'Foo', lastName: 'Bar' });
    });

    afterAll(() => ctx.close());

    it('should concat fields', async () => {
      const result = await ctx.client.selectFirst({
        select: {
          name: concat(field(Person, 'firstName'), field(Person, 'lastName')),
        },
        from: table(Person),
      });
      expect(result).toEqual({ name: 'FooBar' });
    });

    it('should concat values and fields', async () => {
      const result = await ctx.client.selectFirst({
        select: {
          name: concat('Foo ', field(Person, 'lastName')),
        },
        from: table(Person),
      });
      expect(result).toEqual({ name: 'Foo Bar' });
    });
  });
});
