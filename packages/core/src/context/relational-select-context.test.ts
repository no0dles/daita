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

    it('should execute select(User)', async () => {
      const users = await ctx.adminContext.select(User).exec();
      expect(users).toEqual([userA, userB]);
    });

    it('should not execute select(User) without permission', async () => {
      await expect(ctx.viewerContext.select(User).exec()).rejects.toThrow('');
    });

    it('should execute first select(User)', async () => {
      const user = await ctx.adminContext.select(User).execFirst();
      expect(user).toBeInstanceOf(User);
      expect(user).toEqual(userA);
    });

    it('should execute select(User).where({name: foo})', async () => {
      const users = await ctx.adminContext
        .select(User)
        .where({name: 'foo'})
        .exec();
      expect(users).toEqual([userA]);
    });

    it('should execute select(User).where({$or: [{name: foo}, {name: bar}])', async () => {
      const users = await ctx.adminContext
        .select(User)
        .where({$or: [{name: 'foo'}, {name: 'bar'}]})
        .exec();
      expect(users).toEqual([userA, userB]);
    });

    it('should execute select(User).where({$and: [{name: foo}, {name: bar}])', async () => {
      const users = await ctx.adminContext
        .select(User)
        .where({$and: [{name: 'foo'}, {name: 'bar'}]})
        .exec();
      expect(users).toEqual([]);
    });

    it('should execute select(User).where({name: {$eq: foo}})', async () => {
      const users = await ctx.adminContext
        .select(User)
        .where({name: {$eq: 'foo'}})
        .exec();
      expect(users).toEqual([userA]);
    });

    it('should execute select(User).where({name: {$like: fo%}})', async () => {
      const users = await ctx.adminContext
        .select(User)
        .where({name: {$like: 'fo%'}})
        .exec();
      expect(users).toEqual([userA]);
    });

    it('should execute select(User).where({count: {$gt: 2}})', async () => {
      const users = await ctx.adminContext
        .select(User)
        .where({count: {$gt: 2}})
        .exec();
      expect(users).toEqual([userB]);
    });

    it('should execute select(User).where({count: {$gte: 2}})', async () => {
      const users = await ctx.adminContext
        .select(User)
        .where({count: {$gte: 2}})
        .exec();
      expect(users).toEqual([userA, userB]);
    });

    it('should execute select(User).where({count: 2}).where({count: 14})', async () => {
      const users = await ctx.adminContext
        .select(User)
        .where({count: 2})
        .where({count: 14})
        .exec();
      expect(users).toEqual([]);
    });

    it('should execute select(User).skip(1)', async () => {
      const users = await ctx.adminContext
        .select(User)
        .skip(1)
        .orderBy(u => u.name)
        .exec();
      expect(users).toEqual([userA]);
    });

    it('should execute select(User).where({count: 99}).execFirst()', async () => {
      const user = await ctx.adminContext
        .select(User)
        .where({count: 99})
        .execFirst();
      expect(user).toEqual(null);
    });

    it('should execute select(User).where({count: {$lt: 2}})', async () => {
      const users = await ctx.adminContext
        .select(User)
        .where({count: {$lt: 2}})
        .exec();
      expect(users).toEqual([]);
    });

    it('should execute select(User).where({count: {$lte: 2}})', async () => {
      const users = await ctx.adminContext
        .select(User)
        .where({count: {$lte: 2}})
        .exec();
      expect(users).toEqual([userA]);
    });

    it('should execute select(User).where({name: {$in: [foo, bar]}})', async () => {
      const users = await ctx.adminContext
        .select(User)
        .where({name: {$in: ['foo', 'bar']}})
        .exec();
      expect(users).toEqual([userA, userB]);
    });

    it('should execute select(User).where({name: {$nin: [foo, bar]}})', async () => {
      const users = await ctx.adminContext
        .select(User)
        .where({name: {$nin: ['foo', 'bar']}})
        .exec();
      expect(users).toEqual([]);
    });

    it('should execute select(User).where({name: {$ne: foo}})', async () => {
      const users = await ctx.adminContext
        .select(User)
        .where({name: {$ne: 'foo'}})
        .exec();
      expect(users).toEqual([userB]);
    });

    it('should execute count(User)', async () => {
      const count = await ctx.adminContext.select(User).execCount();
      expect(count).toEqual(2);
    });


    it('should execute select(User)', async () => {
      const result = await ctx.adminContext
        .select(User)
        .where({count: 14})
        .execCount();

      expect(result).toEqual(1);
    });


    //todo
    // it('should execute select(User).include(parent)', () => testCase(async (setup) => {
    //   const users = await adminContext
    //     .select(User)
    //     .include(u => u.parent)
    //     .exec();
    //   expect(users).to.be.deep.eq([userA, {...userB, parent: userA}]);
    // }));

    it('should execute select(User).orderBy(name).orderThenBy(count)', async () => {
      const users = await ctx.adminContext
        .select(User)
        .orderBy(u => u.name)
        .orderThenBy(u => u.count)
        .exec();
      expect(users).toEqual([userB, userA]);
    });

    it('should execute select(User).orderBy(name).orderThenBy(count).where({name: foobar})', async () => {
      const users = await ctx.adminContext
        .select(User)
        .orderBy(u => u.name)
        .orderThenBy(u => u.count)
        .where({name: 'foobar'})
        .exec();
      expect(users).toEqual([]);
    });
  });
}
