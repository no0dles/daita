import {User} from '../test';
import {expect} from 'chai';
import {setupAdapters, testCase} from './test-utils';

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

describe('relational-select-context', () => {
  setupAdapters({
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

  describe('should execute select(User)', () => testCase(async (adapterTest) => {
    const users = await adapterTest.context.select(User).exec();
    expect(users).to.deep.eq([userA, userB]);
  }));

  describe('should execute first select(User)', () => testCase(async (adapterTest) => {
    const user = await adapterTest.context.select(User).execFirst();
    expect(user).instanceof(User);
    expect(user).to.deep.eq(userA);
  }));

  describe('should execute select(User).where({name: foo})', () => testCase(async (adapterTest) => {
    const users = await adapterTest.context
      .select(User)
      .where({name: 'foo'})
      .exec();
    expect(users).to.deep.eq([userA]);
  }));

  describe('should execute select(User).where({$or: [{name: foo}, {name: bar}])', () => testCase(async (adapterTest) => {
    const users = await adapterTest.context
      .select(User)
      .where({$or: [{name: 'foo'}, {name: 'bar'}]})
      .exec();
    expect(users).to.deep.eq([userA, userB]);
  }));

  describe('should execute select(User).where({$and: [{name: foo}, {name: bar}])', () => testCase(async (adapterTest) => {
    const users = await adapterTest.context
      .select(User)
      .where({$and: [{name: 'foo'}, {name: 'bar'}]})
      .exec();
    expect(users).to.deep.eq([]);
  }));

  describe('should execute select(User).where({name: {$eq: foo}})', () => testCase(async (adapterTest) => {
    const users = await adapterTest.context
      .select(User)
      .where({name: {$eq: 'foo'}})
      .exec();
    expect(users).to.deep.eq([userA]);
  }));

  describe('should execute select(User).where({name: {$like: fo%}})', () => testCase(async (adapterTest) => {
    const users = await adapterTest.context
      .select(User)
      .where({name: {$like: 'fo%'}})
      .exec();
    expect(users).to.deep.eq([userA]);
  }));

  describe('should execute select(User).where({count: {$gt: 2}})', () => testCase(async (adapterTest) => {
    const users = await adapterTest.context
      .select(User)
      .where({count: {$gt: 2}})
      .exec();
    expect(users).to.deep.eq([userB]);
  }));

  describe('should execute select(User).where({count: {$gte: 2}})', () => testCase(async (adapterTest) => {
    const users = await adapterTest.context
      .select(User)
      .where({count: {$gte: 2}})
      .exec();
    expect(users).to.deep.eq([userA, userB]);
  }));

  describe('should execute select(User).where({count: 2}).where({count: 14})', () => testCase(async (adapterTest) => {
    const users = await adapterTest.context
      .select(User)
      .where({count: 2})
      .where({count: 14})
      .exec();
    expect(users).to.deep.eq([]);
  }));

  describe('should execute select(User).skip(1)', () => testCase(async (adapterTest) => {
    const users = await adapterTest.context
      .select(User)
      .skip(1)
      .orderBy(u => u.name)
      .exec();
    expect(users).to.deep.eq([userA]);
  }));

  describe('should execute select(User).where({count: 99}).execFirst()', () => testCase(async (adapterTest) => {
    const user = await adapterTest.context
      .select(User)
      .where({count: 99})
      .execFirst();
    expect(user).to.be.eq(null);
  }));

  describe('should execute select(User).where({count: {$lt: 2}})', () => testCase(async (adapterTest) => {
    const users = await adapterTest.context
      .select(User)
      .where({count: {$lt: 2}})
      .exec();
    expect(users).to.deep.eq([]);
  }));

  describe('should execute select(User).where({count: {$lte: 2}})', () => testCase(async (adapterTest) => {
    const users = await adapterTest.context
      .select(User)
      .where({count: {$lte: 2}})
      .exec();
    expect(users).to.deep.eq([userA]);
  }));

  describe('should execute select(User).where({name: {$in: [foo, bar]}})', () => testCase(async (adapterTest) => {
    const users = await adapterTest.context
      .select(User)
      .where({name: {$in: ['foo', 'bar']}})
      .exec();
    expect(users).to.deep.eq([userA, userB]);
  }));

  describe('should execute select(User).where({name: {$nin: [foo, bar]}})', () => testCase(async (adapterTest) => {
    const users = await adapterTest.context
      .select(User)
      .where({name: {$nin: ['foo', 'bar']}})
      .exec();
    expect(users).to.deep.eq([]);
  }));

  describe('should execute select(User).where({name: {$ne: foo}})', () => testCase(async (adapterTest) => {
    const users = await adapterTest.context
      .select(User)
      .where({name: {$ne: 'foo'}})
      .exec();
    expect(users).to.deep.eq([userB]);
  }));

  describe('should execute count(User)', () => testCase(async (adapterTest) => {
    const count = await adapterTest.context.select(User).execCount();
    expect(count).to.eq(2);
  }));


  describe('should execute select(User)', () => testCase(async (adapterTest) => {
    const result = await adapterTest.context
      .select(User)
      .where({count: 14})
      .execCount();

    expect(result).to.be.eq(1);
  }));


  //todo
  // describe('should execute select(User).include(parent)', () => testCase(async (setup) => {
  //   const users = await setup.context
  //     .select(User)
  //     .include(u => u.parent)
  //     .exec();
  //   expect(users).to.be.deep.eq([userA, {...userB, parent: userA}]);
  // }));

  describe('should execute select(User).orderBy(name).orderThenBy(count)', () => testCase(async (adapterTest) => {
    const users = await adapterTest.context
      .select(User)
      .orderBy(u => u.name)
      .orderThenBy(u => u.count)
      .exec();
    expect(users).to.be.deep.eq([userB, userA]);
  }));

  describe('should execute select(User).orderBy(name).orderThenBy(count).where({name: foobar})', () => testCase(async (adapterTest) => {
    const users = await adapterTest.context
      .select(User)
      .orderBy(u => u.name)
      .orderThenBy(u => u.count)
      .where({name: 'foobar'})
      .exec();
    expect(users).to.be.deep.eq([]);
  }));
});