import {getTestAdapter, userA, userB} from './seed';
import {blogSchema} from '../schema';
import {blogAdminUser} from '../users';
import {User} from '../models/user';


describe('relational-transaction', () => {
  const dataAdapter = getTestAdapter();

  it('should timeout trx', async () => {
    const adminContext = await blogSchema.transactionContext(dataAdapter, {user: blogAdminUser});
    try {
      await adminContext
        .transaction(async trx => {
          await trx.delete(User)
            .where({id: 'b'});

          await sleep(1300);

          throw new Error('should be canceled by timeout');
        });
    } catch (e) {
      expect(e.message).toEqual('transaction timeout');
    }

    const afterUsers = await adminContext.select(User).orderBy(u => u.id);
    expect(afterUsers).toEqual([userA, userB]);
  });
});


describe('relational-transaction', () => {
  const dataAdapter = getTestAdapter();

  it('should not get mixed up with parallel calls outside of trx', async () => {
    let promise: PromiseLike<any> | null = null;

    const adminContext = await blogSchema.transactionContext(dataAdapter, {user: blogAdminUser});
    try {
      await adminContext
        .transaction(async trx => {
          await trx.delete(User)
            .where({id: 'b'});

          promise = adminContext.delete(User)
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

    const afterUsers = await adminContext.select(User).orderBy(u => u.id);
    expect(afterUsers).toEqual([userB]);
  });

  it('should not be visible outside of trx', async () => {
    const adminContext = await blogSchema.transactionContext(dataAdapter, {user: blogAdminUser});
    await adminContext
      .transaction(async trx => {
        await trx.delete(User)
          .where({id: 'b'});

        const insideUsers = await trx.select(User).orderBy(u => u.id);
        expect(insideUsers).toEqual([userA]);

        const outsideUsers = await adminContext.select(User).orderBy(u => u.id);
        expect(outsideUsers).toEqual([userA, userB]);
      });

    const afterUsers = await adminContext.select(User).orderBy(u => u.id);
    expect(afterUsers).toEqual([userA]);
  });

  it('should rollback trx', async () => {
    const adminContext = await blogSchema.transactionContext(dataAdapter, {user: blogAdminUser});
    try {
      await adminContext
        .transaction(async trx => {
          await trx.delete(User)
            .where({id: 'b'});
          throw new Error('custom err');
        });
    } catch (e) {
      expect(e.message).toEqual('custom err');
    }

    const users = await adminContext.select(User).orderBy(u => u.id);
    expect(users).toEqual([userA, userB]);
  });

  it('should commit trx', async () => {
    const adminContext = await blogSchema.transactionContext(dataAdapter, {user: blogAdminUser});
    await adminContext
      .transaction(async trx => {
        await trx.delete(User)
          .where({id: 'b'});
      });

    const users = await adminContext.select(User).orderBy(u => u.id);
    expect(users).toEqual([userA]);
  });
});
