import {expect} from 'chai';
import {AdapterTest, setupAdapters} from '../test/test-utils';
import {User} from '../test/user';

export function relationalInsertContextTest(adapterTest: AdapterTest) {

  describe('relational-insert-context', () => {
    setupAdapters(adapterTest, {
      cleanup: async (setup) => {
        await setup.context.delete(User).exec();
      },
    });

    it('should execute insert(User).value(id: a, name: foo, count: 2, admin: true)', async() => {
      await testInsert(adapterTest, {id: 'a', name: 'foo', count: 2, admin: true});
    });

    it('should execute insert(User).value(id: a, name: foo, count: null, admin: true)', async() => {
      await testInsert(adapterTest, {id: 'a', name: 'foo', count: null, admin: true});
    });

    it('should not execute insert(User).value(id: a, name: null, count: null, admin: false)', async() => {
      await testFailInsert(adapterTest,
        {
          id: 'a',
          name: null,
          count: null,
          admin: false,
        },
        Error,
        'name is required',
      );
    });

    async function testInsert(adapterTest: AdapterTest, user: any) {
      await adapterTest.context
        .insert(User)
        .value(user)
        .exec();
    }

    async function testFailInsert(adapterTest: AdapterTest, user: any, err: any, message: string) {
      try {
        await testInsert(adapterTest, user);
        expect.fail('expecting error');
      } catch (e) {
        expect(e).to.be.instanceof(err);
        expect(e.message).to.be.eq(message);
      }
    }
  });
}
