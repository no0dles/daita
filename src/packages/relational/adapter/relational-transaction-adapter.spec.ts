import {
  removeTransactionClients,
  transactionClients,
  TransactionClientTestContext,
} from '../../../testing/relational/adapter-test';
import { createPerson, createPersonTable } from '../../../testing/schema/test-schema';
import { table } from '../sql/keyword/table/table';
import { Person } from '../../../testing/schema/person';
import { field } from '../sql/keyword/field/field';
import { equal } from '../sql/operands/comparison/equal/equal';
import { sleep } from '../../common/utils/sleep';

describe('relational/adapter/relational-transaction-adapter', () => {
  describe.each(transactionClients)('%s', (ctxFactory) => {
    let ctx: TransactionClientTestContext;

    beforeAll(async () => {
      ctx = await ctxFactory.clientContext();
      await createPersonTable(ctx.client);
      await createPerson(ctx.client, { firstName: 'Foo', lastName: 'Bar', id: 'a' });
    });

    afterAll(() => ctx.close());

    it('should update in transaction', async () => {
      await ctx.client.transaction(async (trx) => {
        await trx.update({
          set: { birthday: new Date() },
          update: table(Person),
          where: equal(field(Person, 'id'), 'a'),
        });
      });
      const person = await ctx.client.selectFirst({
        select: { birthday: field(Person, 'birthday') },
        from: table(Person),
      });
      expect(person).not.toBeUndefined();
      expect(person).not.toBeNull();
      expect(person.birthday).toBeInstanceOf(Date);
    });

    it('should cancel transaction', async (done) => {
      try {
        await ctx.client.transaction(async (trx) => {
          await trx.update({
            set: { firstName: 'Foo2' },
            update: table(Person),
            where: equal(field(Person, 'id'), 'a'),
          });
          throw new Error('abort');
        });
        done(new Error('should not be successfull'));
      } catch (e) {
        expect(e.message).toEqual('abort');
      }
      const person = await ctx.client.selectFirst({
        select: { firstName: field(Person, 'firstName') },
        from: table(Person),
      });
      expect(person).not.toBeUndefined();
      expect(person).not.toBeNull();
      expect(person.firstName).toEqual('Foo');
      done();
    });
  });

  describe.each(removeTransactionClients)('%s timeout', (ctxFactory) => {
    let ctx: TransactionClientTestContext;

    beforeAll(async () => {
      ctx = await ctxFactory.clientContext();
      await createPersonTable(ctx.client);
      await createPerson(ctx.client, { firstName: 'Foo', lastName: 'Bar', id: 'a' });
    });

    afterAll(() => ctx.close());

    it('should cancel transaction with timeout before changes', async (done) => {
      try {
        await ctx.client.transaction(async (trx) => {
          await sleep(2500);
          await trx.update({
            set: { birthday: new Date() },
            update: table(Person),
            where: equal(field(Person, 'id'), 'a'),
          });
        });
        done(new Error('should not be successfull'));
      } catch (e) {
        expect(e.message).toEqual('timeout');
      }
      const person = await ctx.client.selectFirst({
        select: { birthday: field(Person, 'birthday') },
        from: table(Person),
      });
      expect(person).not.toBeUndefined();
      expect(person).not.toBeNull();
      expect(person.birthday).toBeNull();
      done();
    });

    it('should cancel transaction with timeout after changes', async (done) => {
      try {
        await ctx.client.transaction(async (trx) => {
          await trx.update({
            set: { birthday: new Date() },
            update: table(Person),
            where: equal(field(Person, 'id'), 'a'),
          });
          await sleep(2500);
        });
        done(new Error('should not be successfull'));
      } catch (e) {
        expect(e.message).toEqual('timeout');
      }
      const person = await ctx.client.selectFirst({
        select: { birthday: field(Person, 'birthday') },
        from: table(Person),
      });
      expect(person).not.toBeUndefined();
      expect(person).not.toBeNull();
      expect(person.birthday).toBeNull();
      done();
    });
  });
});
