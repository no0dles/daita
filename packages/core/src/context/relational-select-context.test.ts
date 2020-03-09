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

export function relationalSelectContext(ctx: {adminContext: RelationalDataContext, viewerContext: RelationalDataContext}) {

  describe('relational-select-context', () => {
    beforeAll(async () => {
      await ctx.adminContext.delete(User);
      await ctx.adminContext
        .insert(User)
        .value(userA);
      await ctx.adminContext
        .insert(User)
        .value(userB);
    });

    it('should execute select(User)', async () => {
      const users = await ctx.adminContext.select(User);
      expect(users).toEqual([userA, userB]);
    });

    it('should not execute select(User) without permission', async () => {
      await expect(ctx.viewerContext.select(User)).rejects.toThrow('');
    });

    it('should execute first select(User)', async () => {
      const user = await ctx.adminContext.select(User).first();
      expect(user).toBeInstanceOf(User);
      expect(user).toEqual(userA);
    });

    it('should execute select(User).where({name: foo})', async () => {
      const users = await ctx.adminContext
        .select(User)
        .where({name: 'foo'});
      expect(users).toEqual([userA]);
    });

    it('should execute select(User).where({$or: [{name: foo}, {name: bar}])', async () => {
      const users = await ctx.adminContext
        .select(User)
        .where({$or: [{name: 'foo'}, {name: 'bar'}]});
      expect(users).toEqual([userA, userB]);
    });

    it('should execute select(User).where({$and: [{name: foo}, {name: bar}])', async () => {
      const users = await ctx.adminContext
        .select(User)
        .where({$and: [{name: 'foo'}, {name: 'bar'}]});
      expect(users).toEqual([]);
    });

    it('should execute select(User).where({name: {$eq: foo}})', async () => {
      const users = await ctx.adminContext
        .select(User)
        .where({name: {$eq: 'foo'}});
      expect(users).toEqual([userA]);
    });

    it('should execute select(User).where({name: {$like: fo%}})', async () => {
      const users = await ctx.adminContext
        .select(User)
        .where({name: {$like: 'fo%'}});
      expect(users).toEqual([userA]);
    });

    it('should execute select(User).where({count: {$gt: 2}})', async () => {
      const users = await ctx.adminContext
        .select(User)
        .where({count: {$gt: 2}});
      expect(users).toEqual([userB]);
    });

    it('should execute select(User).where({count: {$gte: 2}})', async () => {
      const users = await ctx.adminContext
        .select(User)
        .where({count: {$gte: 2}});
      expect(users).toEqual([userA, userB]);
    });

    it('should execute select(User).where({count: 2}).where({count: 14})', async () => {
      const users = await ctx.adminContext
        .select(User)
        .where({count: 2})
        .where({count: 14});
      expect(users).toEqual([]);
    });

    it('should execute select(User).skip(1)', async () => {
      const users = await ctx.adminContext
        .select(User)
        .skip(1)
        .orderBy(u => u.name);
      expect(users).toEqual([userA]);
    });

    it('should execute select(User).where({count: 99}).execFirst()', async () => {
      const user = await ctx.adminContext
        .select(User)
        .where({count: 99})
        .first();
      expect(user).toEqual(null);
    });

    it('should execute select(User).where({count: {$lt: 2}})', async () => {
      const users = await ctx.adminContext
        .select(User)
        .where({count: {$lt: 2}});
      expect(users).toEqual([]);
    });

    it('should execute select(User).where({count: {$lte: 2}})', async () => {
      const users = await ctx.adminContext
        .select(User)
        .where({count: {$lte: 2}});
      expect(users).toEqual([userA]);
    });

    it('should execute select(User).where({name: {$in: [foo, bar]}})', async () => {
      const users = await ctx.adminContext
        .select(User)
        .where({name: {$in: ['foo', 'bar']}});
      expect(users).toEqual([userA, userB]);
    });

    it('should execute select(User).where({name: {$nin: [foo, bar]}})', async () => {
      const users = await ctx.adminContext
        .select(User)
        .where({name: {$nin: ['foo', 'bar']}});
      expect(users).toEqual([]);
    });

    it('should execute select(User).where({name: {$ne: foo}})', async () => {
      const users = await ctx.adminContext
        .select(User)
        .where({name: {$ne: 'foo'}});
      expect(users).toEqual([userB]);
    });

    it('should execute count(User)', async () => {
      const count = await ctx.adminContext.select(User).count();
      expect(count).toEqual(2);
    });


    it('should execute select(User)', async () => {
      const result = await ctx.adminContext
        .select(User)
        .where({count: 14})
        .count();

      expect(result).toEqual(1);
    });

    it('should execute select(User).include(parent)', async () => {
      const users = await ctx.adminContext
        .select(User)
        .include(u => u.parent);
      expect(users).toEqual([userA, {...userB, parent: userA}]);
    });

    it('should execute select(User).orderBy(name).orderThenBy(count)', async () => {
      const users = await ctx.adminContext
        .select(User)
        .orderBy(u => u.name)
        .orderThenBy(u => u.count);
      expect(users).toEqual([userB, userA]);
    });

    it('should execute select(User).orderBy(name).orderThenBy(count).where({name: foobar})', async () => {
      const users = await ctx.adminContext
        .select(User)
        .orderBy(u => u.name)
        .orderThenBy(u => u.count)
        .where({name: 'foobar'});
      expect(users).toEqual([]);
    });
  });
}
