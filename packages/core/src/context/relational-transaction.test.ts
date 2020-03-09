import {User} from '../test/schemas/blog/models/user';
import {RelationalTransactionContext} from './relational-transaction-context';
import {RelationalDataContext} from './relational-data-context';

const userA = {
  id: 'a',
  name: 'foo',
  count: 2,
  admin: true,
  parentId: null,
};
const userB = {
  id: 'b',
  name: 'bar',
  count: 14,
  admin: false,
  parentId: null,
};

function sleep(timeout: number) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), timeout);
  });
}

export function relationalTransactionRemoteTest(ctx: {adminContext: RelationalTransactionContext}) {

  describe('relational-transaction', () => {
    beforeEach(async () => {
      await ctx.adminContext.delete(User);
      await ctx.adminContext
        .insert(User)
        .value(userA);
      await ctx.adminContext
        .insert(User)
        .value(userB);
    });

    it('should timeout trx', async () => {
      try {
        await ctx.adminContext
          .transaction(async (trx) => {
            await trx.delete(User)
              .where({id: 'b'});

            await sleep(1300);

            throw new Error('should be canceled by timeout');
          });
      } catch (e) {
        expect(e.message).toEqual('transaction timeout');
      }

      const afterUsers = await ctx.adminContext.select(User).orderBy(u => u.id);
      expect(afterUsers).toEqual([userA, userB]);
    });
  });
}

export function relationalTransactionTest(ctx: {adminContext: RelationalTransactionContext}) {

  describe('relational-transaction', () => {
    beforeEach(async () => {
      await ctx.adminContext.delete(User);
      await ctx.adminContext
        .insert(User)
        .value(userA);
      await ctx.adminContext
        .insert(User)
        .value(userB);
    });

    it('should not get mixed up with parallel calls outside of trx', async () => {
      let promise: PromiseLike<any> | null = null;

      try {
        await ctx.adminContext
          .transaction(async (trx) => {
            await trx.delete(User)
              .where({id: 'b'});

            promise = ctx.adminContext.delete(User)
              .where({id: 'a'});

            throw new Error('cancel');
          });
        throw new Error('should have been canceled');
      } catch (e) {
        expect(e.message).toEqual('cancel');
      }

      if (promise) {
        await promise;
      }

      const afterUsers = await ctx.adminContext.select(User).orderBy(u => u.id);
      expect(afterUsers).toEqual([userB]);
    });

    it('should not be visible outside of trx', async () => {
      await ctx.adminContext
        .transaction(async (trx) => {
          await trx.delete(User)
            .where({id: 'b'});

          const insideUsers = await trx.select(User).orderBy(u => u.id);
          expect(insideUsers).toEqual([userA]);

          const outsideUsers = await ctx.adminContext.select(User).orderBy(u => u.id);
          expect(outsideUsers).toEqual([userA, userB]);
        });

      const afterUsers = await ctx.adminContext.select(User).orderBy(u => u.id);
      expect(afterUsers).toEqual([userA]);
    });

    it('should rollback trx', async () => {
      try {
        await ctx.adminContext
          .transaction(async (trx) => {
            await trx.delete(User)
              .where({id: 'b'});
            throw new Error('custom err');
          });
      } catch (e) {
        expect(e.message).toEqual('custom err');
      }

      const users = await ctx.adminContext.select(User).orderBy(u => u.id);
      expect(users).toEqual([userA, userB]);
    });

    it('should commit trx', async () => {
      await ctx.adminContext
        .transaction(async (trx) => {
          await trx.delete(User)
            .where({id: 'b'});
        });

      const users = await ctx.adminContext.select(User).orderBy(u => u.id);
      expect(users).toEqual([userA]);
    });
  });
}
