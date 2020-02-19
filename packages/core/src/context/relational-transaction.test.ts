import {expect} from 'chai';
import {AdapterTest, setupAdapters} from '../test/test-utils';
import {User} from '../test/user';

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

export function relationalTransactionTest(adapterTest: AdapterTest) {

  describe('relational-transaction', () => {
    setupAdapters(adapterTest,{
      seed: async (setup) => {
        await setup.context
          .insert(User)
          .value(userA)
          .exec();
        await setup.context
          .insert(User)
          .value(userB)
          .exec();
      },
      cleanup: async (setup) => {
        await setup.context.delete(User).exec();
      },
    });

    if (adapterTest.isRemote) {
      it('should timeout trx', async () => {
        try {
          await adapterTest.context
            .transaction(async (trx) => {
              await trx.delete(User)
                .where({id: 'b'})
                .exec();

              await sleep(1300);

              throw new Error('should be canceled by timeout');
            });
        } catch (e) {
          expect(e.message).to.be.eq('transaction timeout');
        }

        const afterUsers = await adapterTest.context.select(User).orderBy(u => u.id).exec();
        expect(afterUsers).to.be.deep.eq([userA, userB]);
      });
    }

    it('should not get mixed up with parallel calls outside of trx', async () => {
      let promise: Promise<any> | null = null;

      try {
        await adapterTest.context
          .transaction(async (trx) => {
            await trx.delete(User)
              .where({id: 'b'})
              .exec();

            promise = adapterTest.context.delete(User)
              .where({id: 'a'})
              .exec();

            throw new Error('cancel');
          });
        throw new Error('should have been canceled');
      } catch (e) {
        expect(e.message).to.be.eq('cancel');
      }

      if (promise) {
        await promise;
      }

      const afterUsers = await adapterTest.context.select(User).orderBy(u => u.id).exec();
      expect(afterUsers).to.be.deep.eq([userB]);
    });

    it('should not be visible outside of trx', async () => {
      await adapterTest.context
        .transaction(async (trx) => {
          await trx.delete(User)
            .where({id: 'b'})
            .exec();

          const insideUsers = await trx.select(User).orderBy(u => u.id).exec();
          expect(insideUsers).to.be.deep.eq([userA]);

          const outsideUsers = await adapterTest.context.select(User).orderBy(u => u.id).exec();
          expect(outsideUsers).to.be.deep.eq([userA, userB]);
        });

      const afterUsers = await adapterTest.context.select(User).orderBy(u => u.id).exec();
      expect(afterUsers).to.be.deep.eq([userA]);
    });

    it('should rollback trx', async () => {
      try {
        await adapterTest.context
          .transaction(async (trx) => {
            await trx.delete(User)
              .where({id: 'b'})
              .exec();
            throw new Error('custom err');
          });
      } catch (e) {
        expect(e.message).to.be.eq('custom err');
      }

      const users = await adapterTest.context.select(User).orderBy(u => u.id).exec();
      expect(users).to.be.deep.eq([userA, userB]);
    });

    it('should commit trx', async () => {
      await adapterTest.context
        .transaction(async (trx) => {
          await trx.delete(User)
            .where({id: 'b'})
            .exec();
        });

      const users = await adapterTest.context.select(User).orderBy(u => u.id).exec();
      expect(users).to.be.deep.eq([userA]);
    });
  });
}
