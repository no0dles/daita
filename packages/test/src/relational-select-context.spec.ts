import { PostgresDataAdapter } from '@daita/core/dist/postgres';
import { dropDatabase } from '@daita/core/dist/postgres/postgres.util';
import { RelationalContext } from '@daita/core';
import { testConnectionString, testSchema, User } from './test';
import { expect } from 'chai';

describe('relational-select-context', () => {
  const userA = {
    id: 'a',
    name: 'foo',
    count: 2,
    admin: true,
    parentId: null,
    parent: null,
  };
  const userB = {
    id: 'b',
    name: 'bar',
    count: 14,
    admin: false,
    parentId: 'a',
  };

  let dataAdapter: PostgresDataAdapter;
  let context: RelationalContext;

  beforeEach(async () => {
    await dropDatabase(testConnectionString);
    dataAdapter = new PostgresDataAdapter(testConnectionString);
    context = testSchema.context(dataAdapter);
    await context.migration().apply();
    await context
      .insert(User)
      .value(userA)
      .exec();
    await context
      .insert(User)
      .value(userB)
      .exec();
  });

  afterEach(async () => {
    if (dataAdapter) {
      await dataAdapter.close();
    }
  });

  it('should execute select(User)', async () => {
    const users = await context.select(User).exec();
    expect(users).to.deep.eq([userA, userB]);
  });

  it('should execute first select(User)', async () => {
    const user = await context.select(User).execFirst();
    expect(user).to.deep.eq(userA);
  });

  it('should execute select(User).where({name: foo})', async () => {
    const users = await context
      .select(User)
      .where({ name: 'foo' })
      .exec();
    expect(users).to.deep.eq([userA]);
  });

  it('should execute select(User).where({$or: [{name: foo}, {name: bar}])', async () => {
    const users = await context
      .select(User)
      .where({ $or: [{ name: 'foo' }, { name: 'bar' }] })
      .exec();
    expect(users).to.deep.eq([userA, userB]);
  });

  it('should execute select(User).where({$and: [{name: foo}, {name: bar}])', async () => {
    const users = await context
      .select(User)
      .where({ $and: [{ name: 'foo' }, { name: 'bar' }] })
      .exec();
    expect(users).to.deep.eq([]);
  });

  it('should execute select(User).where({name: {$eq: foo}})', async () => {
    const users = await context
      .select(User)
      .where({ name: { $eq: 'foo' } })
      .exec();
    expect(users).to.deep.eq([userA]);
  });

  it('should execute select(User).where({name: {$like: fo%}})', async () => {
    const users = await context
      .select(User)
      .where({ name: { $like: 'fo%' } })
      .exec();
    expect(users).to.deep.eq([userA]);
  });

  it('should execute select(User).where({count: {$gt: 2}})', async () => {
    const users = await context
      .select(User)
      .where({ count: { $gt: 2 } })
      .exec();
    expect(users).to.deep.eq([userB]);
  });

  it('should execute select(User).where({count: {$gte: 2}})', async () => {
    const users = await context
      .select(User)
      .where({ count: { $gte: 2 } })
      .exec();
    expect(users).to.deep.eq([userA, userB]);
  });

  it('should execute select(User).where({count: {$lt: 2}})', async () => {
    const users = await context
      .select(User)
      .where({ count: { $lt: 2 } })
      .exec();
    expect(users).to.deep.eq([]);
  });

  it('should execute select(User).where({count: {$lte: 2}})', async () => {
    const users = await context
      .select(User)
      .where({ count: { $lte: 2 } })
      .exec();
    expect(users).to.deep.eq([userA]);
  });

  it('should execute select(User).where({name: {$in: [foo, bar]}})', async () => {
    const users = await context
      .select(User)
      .where({ name: { $in: ['foo', 'bar'] } })
      .exec();
    expect(users).to.deep.eq([userA, userB]);
  });

  it('should execute select(User).where({name: {$nin: [foo, bar]}})', async () => {
    const users = await context
      .select(User)
      .where({ name: { $nin: ['foo', 'bar'] } })
      .exec();
    expect(users).to.deep.eq([]);
  });

  it('should execute select(User).where({name: {$ne: foo}})', async () => {
    const users = await context
      .select(User)
      .where({ name: { $ne: 'foo' } })
      .exec();
    expect(users).to.deep.eq([userB]);
  });

  it('should execute count(User)', async () => {
    const count = await context.select(User).execCount();
    expect(count).to.eq(2);
  });

  it('should execute select(User).include(parent)', async () => {
    const users = await context
      .select(User)
      .include(u => u.parent)
      .exec();
    expect(users).to.be.deep.eq([userA, { ...userB, parent: userA }]);
  });

  it('should execute select(User).orderBy(name).orderThenBy(count)', async () => {
    const users = await context
      .select(User)
      .orderBy(u => u.name)
      .orderThenBy(u => u.count)
      .exec();
    expect(users).to.be.deep.eq([userB, userA]);
  });
});
