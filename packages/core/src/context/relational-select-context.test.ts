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
  parentId: 'a',
};

export function relationalSelectContext(adapterTest: AdapterTest) {
  describe('relational-select-context', () => {
    setupAdapters(adapterTest,{
      seedOnce: async (setup) => {
        await setup.context
          .insert(User)
          .value(userA)
          .exec();
        await setup.context
          .insert(User)
          .value(userB)
          .exec();
      },
      cleanupOnce: async (setup) => {
        await setup.context.delete(User);
      },
    });

    it('should execute select(User)', async() => {
      const users = await adapterTest.context.select(User).exec();
      expect(users).to.deep.eq([userA, userB]);
    });

    it('should execute first select(User)', async() => {
      const user = await adapterTest.context.select(User).execFirst();
      expect(user).instanceof(User);
      expect(user).to.deep.eq(userA);
    });

    it('should execute select(User).where({name: foo})', async() => {
      const users = await adapterTest.context
        .select(User)
        .where({name: 'foo'})
        .exec();
      expect(users).to.deep.eq([userA]);
    });

    it('should execute select(User).where({$or: [{name: foo}, {name: bar}])', async() => {
      const users = await adapterTest.context
        .select(User)
        .where({$or: [{name: 'foo'}, {name: 'bar'}]})
        .exec();
      expect(users).to.deep.eq([userA, userB]);
    });

    it('should execute select(User).where({$and: [{name: foo}, {name: bar}])', async() => {
      const users = await adapterTest.context
        .select(User)
        .where({$and: [{name: 'foo'}, {name: 'bar'}]})
        .exec();
      expect(users).to.deep.eq([]);
    });

    it('should execute select(User).where({name: {$eq: foo}})', async() => {
      const users = await adapterTest.context
        .select(User)
        .where({name: {$eq: 'foo'}})
        .exec();
      expect(users).to.deep.eq([userA]);
    });

    it('should execute select(User).where({name: {$like: fo%}})', async() => {
      const users = await adapterTest.context
        .select(User)
        .where({name: {$like: 'fo%'}})
        .exec();
      expect(users).to.deep.eq([userA]);
    });

    it('should execute select(User).where({count: {$gt: 2}})', async() => {
      const users = await adapterTest.context
        .select(User)
        .where({count: {$gt: 2}})
        .exec();
      expect(users).to.deep.eq([userB]);
    });

    it('should execute select(User).where({count: {$gte: 2}})', async() => {
      const users = await adapterTest.context
        .select(User)
        .where({count: {$gte: 2}})
        .exec();
      expect(users).to.deep.eq([userA, userB]);
    });

    it('should execute select(User).where({count: 2}).where({count: 14})', async() => {
      const users = await adapterTest.context
        .select(User)
        .where({count: 2})
        .where({count: 14})
        .exec();
      expect(users).to.deep.eq([]);
    });

    it('should execute select(User).skip(1)', async() => {
      const users = await adapterTest.context
        .select(User)
        .skip(1)
        .orderBy(u => u.name)
        .exec();
      expect(users).to.deep.eq([userA]);
    });

    it('should execute select(User).where({count: 99}).execFirst()', async() => {
      const user = await adapterTest.context
        .select(User)
        .where({count: 99})
        .execFirst();
      expect(user).to.be.eq(null);
    });

    it('should execute select(User).where({count: {$lt: 2}})', async() => {
      const users = await adapterTest.context
        .select(User)
        .where({count: {$lt: 2}})
        .exec();
      expect(users).to.deep.eq([]);
    });

    it('should execute select(User).where({count: {$lte: 2}})', async() => {
      const users = await adapterTest.context
        .select(User)
        .where({count: {$lte: 2}})
        .exec();
      expect(users).to.deep.eq([userA]);
    });

    it('should execute select(User).where({name: {$in: [foo, bar]}})', async() => {
      const users = await adapterTest.context
        .select(User)
        .where({name: {$in: ['foo', 'bar']}})
        .exec();
      expect(users).to.deep.eq([userA, userB]);
    });

    it('should execute select(User).where({name: {$nin: [foo, bar]}})', async() => {
      const users = await adapterTest.context
        .select(User)
        .where({name: {$nin: ['foo', 'bar']}})
        .exec();
      expect(users).to.deep.eq([]);
    });

    it('should execute select(User).where({name: {$ne: foo}})', async() => {
      const users = await adapterTest.context
        .select(User)
        .where({name: {$ne: 'foo'}})
        .exec();
      expect(users).to.deep.eq([userB]);
    });

    it('should execute count(User)', async() => {
      const count = await adapterTest.context.select(User).execCount();
      expect(count).to.eq(2);
    });


    it('should execute select(User)', async() => {
      const result = await adapterTest.context
        .select(User)
        .where({count: 14})
        .execCount();

      expect(result).to.be.eq(1);
    });


    //todo
    // it('should execute select(User).include(parent)', () => testCase(async (setup) => {
    //   const users = await setup.context
    //     .select(User)
    //     .include(u => u.parent)
    //     .exec();
    //   expect(users).to.be.deep.eq([userA, {...userB, parent: userA}]);
    // }));

    it('should execute select(User).orderBy(name).orderThenBy(count)', async() => {
      const users = await adapterTest.context
        .select(User)
        .orderBy(u => u.name)
        .orderThenBy(u => u.count)
        .exec();
      expect(users).to.be.deep.eq([userB, userA]);
    });

    it('should execute select(User).orderBy(name).orderThenBy(count).where({name: foobar})', async() => {
      const users = await adapterTest.context
        .select(User)
        .orderBy(u => u.name)
        .orderThenBy(u => u.count)
        .where({name: 'foobar'})
        .exec();
      expect(users).to.be.deep.eq([]);
    });
  });
}
