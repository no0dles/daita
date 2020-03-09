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

export function relationalUpdateContextTest(ctx: {adminContext: RelationalDataContext}) {
  describe('relational-update-context', () => {
    beforeEach(async () => {
      await ctx.adminContext.delete(User);
      await ctx.adminContext
        .insert(User)
        .value(userA);
      await ctx.adminContext
        .insert(User)
        .value(userB);
    });

    it('should update(User).set(name: bar).where(id: a)', async () => {
      const result = await ctx.adminContext
        .update(User)
        .set({name: 'bar'})
        .where({id: 'a'});
      expect(result).toEqual({affectedRows: 1});
      const serverUsers = await ctx.adminContext
        .select(User)
        .orderBy(s => s.id);
      expect(serverUsers).toEqual([
        {...userA, name: 'bar'},
        userB,
      ]);
    });
  });
}