import {RelationalDataAdapterFactory, SchemaTest} from '../test/test-utils';
import {RelationalContext} from './relational-context';
import {blogSchema} from '../test/schemas/blog/schema';
import {blogAdminUser} from '../test/schemas/blog/users';
import {User} from '../test/schemas/blog/models/user';

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

export function relationalTransactionRemoteTest(adapterFactory: RelationalDataAdapterFactory) {

  describe('relational-transaction', () => {
    let schema: SchemaTest;
    let adminContext: RelationalContext;

    beforeEach(async () => {
      schema = new SchemaTest(blogSchema, adapterFactory);
      adminContext = await schema.getContext({user: blogAdminUser});

      await adminContext.migration().apply();
      await adminContext
        .insert(User)
        .value(userA)
        .exec();
      await adminContext
        .insert(User)
        .value(userB)
        .exec();
    });

    afterEach(async () => {
      await schema.close();
    });

    it('should timeout trx', async () => {
      try {
        await adminContext
          .transaction(async (trx) => {
            await trx.delete(User)
              .where({id: 'b'})
              .exec();

            await sleep(1300);

            throw new Error('should be canceled by timeout');
          });
      } catch (e) {
        expect(e.message).toEqual('transaction timeout');
      }

      const afterUsers = await adminContext.select(User).orderBy(u => u.id).exec();
      expect(afterUsers).toEqual([userA, userB]);
    });

  });
}

export function relationalTransactionTest(adapterFactory: RelationalDataAdapterFactory) {

  describe('relational-transaction', () => {
    let schema: SchemaTest;
    let adminContext: RelationalContext;

    beforeEach(async () => {
      schema = new SchemaTest(blogSchema, adapterFactory);
      adminContext = await schema.getContext({user: blogAdminUser});

      await adminContext.migration().apply();
      await adminContext
        .insert(User)
        .value(userA)
        .exec();
      await adminContext
        .insert(User)
        .value(userB)
        .exec();
    });

    afterEach(async () => {
      await schema.close();
    });

    it('should not get mixed up with parallel calls outside of trx', async () => {
      let promise: Promise<any> | null = null;

      try {
        await adminContext
          .transaction(async (trx) => {
            await trx.delete(User)
              .where({id: 'b'})
              .exec();

            promise = adminContext.delete(User)
              .where({id: 'a'})
              .exec();

            throw new Error('cancel');
          });
        throw new Error('should have been canceled');
      } catch (e) {
        expect(e.message).toEqual('cancel');
      }

      if (promise) {
        await promise;
      }

      const afterUsers = await adminContext.select(User).orderBy(u => u.id).exec();
      expect(afterUsers).toEqual([userB]);
    });

    it('should not be visible outside of trx', async () => {
      await adminContext
        .transaction(async (trx) => {
          await trx.delete(User)
            .where({id: 'b'})
            .exec();

          const insideUsers = await trx.select(User).orderBy(u => u.id).exec();
          expect(insideUsers).toEqual([userA]);

          const outsideUsers = await adminContext.select(User).orderBy(u => u.id).exec();
          expect(outsideUsers).toEqual([userA, userB]);
        });

      const afterUsers = await adminContext.select(User).orderBy(u => u.id).exec();
      expect(afterUsers).toEqual([userA]);
    });

    it('should rollback trx', async () => {
      try {
        await adminContext
          .transaction(async (trx) => {
            await trx.delete(User)
              .where({id: 'b'})
              .exec();
            throw new Error('custom err');
          });
      } catch (e) {
        expect(e.message).toEqual('custom err');
      }

      const users = await adminContext.select(User).orderBy(u => u.id).exec();
      expect(users).toEqual([userA, userB]);
    });

    it('should commit trx', async () => {
      await adminContext
        .transaction(async (trx) => {
          await trx.delete(User)
            .where({id: 'b'})
            .exec();
        });

      const users = await adminContext.select(User).orderBy(u => u.id).exec();
      expect(users).toEqual([userA]);
    });
  });
}
