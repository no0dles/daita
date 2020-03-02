import {User} from '../test/schemas/blog/models/user';
import {RelationalDataContext} from './relational-data-context';

export function relationalInsertContextTest(ctx: {adminContext: RelationalDataContext}) {
  describe('relational-insert-context', () => {

    beforeEach(async () => {
      await ctx.adminContext.delete(User).exec()
    });

    it('should execute insert(User).value(id: a, name: foo, count: 2, admin: true)', async () => {
      await testInsert({id: 'a', name: 'foo', count: 2, admin: true});
    });

    it('should execute insert(User).value(id: a, name: foo, count: null, admin: true)', async () => {
      await testInsert({id: 'a', name: 'foo', count: null, admin: true});
    });

    it('should not execute insert(User).value(id: a, name: null, count: null, admin: false)', async () => {
      await testFailInsert(
        {
          id: 'a',
          name: null,
          count: null,
          admin: false,
        },
        'name is required',
      );
    });

    async function testInsert(user: any) {
      await ctx.adminContext
        .insert(User)
        .value(user)
        .exec();
    }

    async function testFailInsert(user: any, message: string) {
      await expect(testInsert(user)).rejects.toThrow(message);
    }
  });
}
