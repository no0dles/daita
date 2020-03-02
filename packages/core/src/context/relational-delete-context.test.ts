import {User} from '../test/schemas/blog/models/user';
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
  parentId: 'a',
};

export function relationalDeleteContextTest(ctx: {adminContext: RelationalDataContext}) {
  describe('relational-delete-context', () => {

    beforeEach(async () => {
      await ctx.adminContext.delete(User).exec();
      await ctx.adminContext
        .insert(User)
        .value(userA)
        .exec();
      await ctx.adminContext
        .insert(User)
        .value(userB)
        .exec();
    });

    it('should execute delete(User).where(id: b)', async () => {
      const result = await ctx.adminContext
        .delete(User)
        .where({id: 'b'})
        .exec();
      expect(result).toEqual({affectedRows: 1});
      const serverUsers = await ctx.adminContext.select(User).exec();
      expect(serverUsers).toEqual([userA]);
    });
  });
}
