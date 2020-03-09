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
      await ctx.adminContext.delete(User);
      await ctx.adminContext
        .insert(User)
        .value(userA);
      await ctx.adminContext
        .insert(User)
        .value(userB);
    });

    it('should execute delete(User).where(id: b)', async () => {
      const result = await ctx.adminContext
        .delete(User)
        .where({id: 'b'});
      expect(result).toEqual({affectedRows: 1});
      const serverUsers = await ctx.adminContext.select(User);
      expect(serverUsers).toEqual([userA]);
    });
  });
}
