import { createPerson, createPersonTable } from '../../../../testing/schema/test-schema';
import { table } from '../../../relational/sql/keyword/table/table';
import { Person } from '../../../../docs/example/models/person';
import { field } from '../../../relational/sql/keyword/field/field';
import { equal } from '../../../relational/sql/operands/comparison/equal/equal';
import { testClient } from '../../../../testing/relational/adapters';

describe('relational/adapter/relational-transaction-adapter/transaction', () => {
  const clients = testClient('pg', 'sqlite', 'mariadb');

  describe.each(clients)('%s', (client) => {
    beforeAll(async () => {
      await createPersonTable(client);
      await createPerson(client, { firstName: 'Foo', lastName: 'Bar', id: 'e047c3d4-e217-498a-bc98-13b6419fc578' });
    });

    afterAll(() => client.close());

    it('should update in transaction', async () => {
      await client.transaction(async (trx) => {
        await trx.update({
          set: { birthday: new Date() },
          update: table(Person),
          where: equal(field(Person, 'id'), 'e047c3d4-e217-498a-bc98-13b6419fc578'),
        });
      });
      const person = await client.selectFirst({
        select: { birthday: field(Person, 'birthday') },
        from: table(Person),
      });
      expect(person).not.toBeUndefined();
      expect(person).not.toBeNull();
      expect(person.birthday).toBeInstanceOf(Date);
    });

    it('should cancel transaction', async (done) => {
      try {
        await client.transaction(async (trx) => {
          await trx.update({
            set: { firstName: 'Foo2' },
            update: table(Person),
            where: equal(field(Person, 'id'), 'e047c3d4-e217-498a-bc98-13b6419fc578'),
          });
          throw new Error('abort');
        });
        done(new Error('should not be successfull'));
      } catch (e) {
        expect(e.message).toEqual('abort');
      }
      const person = await client.selectFirst({
        select: { firstName: field(Person, 'firstName') },
        from: table(Person),
      });
      expect(person).not.toBeUndefined();
      expect(person).not.toBeNull();
      expect(person.firstName).toEqual('Foo');
      done();
    });
  });
});
