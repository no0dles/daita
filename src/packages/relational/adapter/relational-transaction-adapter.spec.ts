import { remoteTransactionContexts, transactionContexts } from '../../../testing/relational/adapters';
import { createPerson, createPersonTable, testSchema } from '../../../testing/schema/test-schema';
import { table } from '../sql/keyword/table/table';
import { Person } from '../../../testing/schema/person';
import { field } from '../sql/keyword/field/field';
import { equal } from '../sql/operands/comparison/equal/equal';
import { sleep } from '../../common/utils/sleep';
import { TransactionContextTestContext } from '../../../testing/relational/adapter/transaction-context-test-context';

describe('relational/adapter/relational-transaction-adapter', () => {
  describe.each(transactionContexts)('%s', (ctxFactory) => {
    let ctx: TransactionContextTestContext;

    beforeAll(async () => {
      ctx = await ctxFactory.getContext(testSchema);
      await createPersonTable(ctx.context);
      await createPerson(ctx.context, { firstName: 'Foo', lastName: 'Bar', id: 'a' });
    });

    afterAll(() => ctx.close());

    it('should update in transaction', async () => {
      await ctx.context.transaction(async (trx) => {
        await trx.update({
          set: { birthday: new Date() },
          update: table(Person),
          where: equal(field(Person, 'id'), 'a'),
        });
      });
      const person = await ctx.context.selectFirst({
        select: { birthday: field(Person, 'birthday') },
        from: table(Person),
      });
      expect(person).not.toBeUndefined();
      expect(person).not.toBeNull();
      expect(person.birthday).toBeInstanceOf(Date);
    });

    it('should cancel transaction', async (done) => {
      try {
        await ctx.context.transaction(async (trx) => {
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
      const person = await ctx.context.selectFirst({
        select: { firstName: field(Person, 'firstName') },
        from: table(Person),
      });
      expect(person).not.toBeUndefined();
      expect(person).not.toBeNull();
      expect(person.firstName).toEqual('Foo');
      done();
    });
  });

  describe.each(remoteTransactionContexts)('%s timeout', (ctxFactory) => {
    let ctx: TransactionContextTestContext;

    beforeAll(async () => {
      ctx = await ctxFactory.getContext(testSchema);
      await createPersonTable(ctx.context);
      await createPerson(ctx.context, { firstName: 'Foo', lastName: 'Bar', id: 'a' });
    });

    afterAll(() => ctx.close());

    it('should cancel transaction with timeout before changes', async (done) => {
      try {
        await ctx.context.transaction(async (trx) => {
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
      const person = await ctx.context.selectFirst({
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
        await ctx.context.transaction(async (trx) => {
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
      const person = await ctx.context.selectFirst({
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
