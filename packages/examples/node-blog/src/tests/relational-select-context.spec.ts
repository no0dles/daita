import {blogSchema} from '../schema';
import {blogAdminUser, blogViewUser} from '../users';
import {getTestAdapter, migrate, seed, userA, userB} from './seed';
import {User} from '../models/user';

describe('relational-select-context', () => {
  const dataAdapter = getTestAdapter();

  beforeAll(async() => await migrate(dataAdapter, blogSchema));
  beforeEach(async () => await seed(dataAdapter, blogSchema).clear(User).table(User, [userA, userB]));

  it('should execute select(User)', async () => {
    const adminContext = await blogSchema.context(dataAdapter, {user: blogAdminUser});
    const users = await adminContext.select(User);
    expect(users).toEqual([userA, userB]);
  });

  it('should not execute select(User) without permission', async () => {
    const viewerContext = await blogSchema.context(dataAdapter, {user: blogViewUser});
    await expect(viewerContext.select(User)).rejects.toThrow('');
  });

  it('should execute first select(User)', async () => {
    const adminContext = await blogSchema.context(dataAdapter, {user: blogAdminUser});
    const user = await adminContext.select(User).first();
    expect(user).toBeInstanceOf(User);
    expect(user).toEqual(userA);
  });

  it('should execute select(User).where({name: foo})', async () => {
    const adminContext = await blogSchema.context(dataAdapter, {user: blogAdminUser});
    const users = await adminContext
      .select(User)
      .where({name: 'foo'});
    expect(users).toEqual([userA]);
  });

  it('should execute select(User).where({$or: [{name: foo}, {name: bar}])', async () => {
    const adminContext = await blogSchema.context(dataAdapter, {user: blogAdminUser});
    const users = await adminContext
      .select(User)
      .where({$or: [{name: 'foo'}, {name: 'bar'}]});
    expect(users).toEqual([userA, userB]);
  });

  it('should execute select(User).where({$and: [{name: foo}, {name: bar}])', async () => {
    const adminContext = await blogSchema.context(dataAdapter, {user: blogAdminUser});
    const users = await adminContext
      .select(User)
      .where({$and: [{name: 'foo'}, {name: 'bar'}]});
    expect(users).toEqual([]);
  });

  it('should execute select(User).where({name: {$eq: foo}})', async () => {
    const adminContext = await blogSchema.context(dataAdapter, {user: blogAdminUser});
    const users = await adminContext
      .select(User)
      .where({name: {$eq: 'foo'}});
    expect(users).toEqual([userA]);
  });

  it('should execute select(User).where({name: {$like: fo%}})', async () => {
    const adminContext = await blogSchema.context(dataAdapter, {user: blogAdminUser});
    const users = await adminContext
      .select(User)
      .where({name: {$like: 'fo%'}});
    expect(users).toEqual([userA]);
  });

  it('should execute select(User).where({count: {$gt: 2}})', async () => {
    const adminContext = await blogSchema.context(dataAdapter, {user: blogAdminUser});
    const users = await adminContext
      .select(User)
      .where({count: {$gt: 2}});
    expect(users).toEqual([userB]);
  });

  it('should execute select(User).where({count: {$gte: 2}})', async () => {
    const adminContext = await blogSchema.context(dataAdapter, {user: blogAdminUser});
    const users = await adminContext
      .select(User)
      .where({count: {$gte: 2}});
    expect(users).toEqual([userA, userB]);
  });

  it('should execute select(User).where({count: 2}).where({count: 14})', async () => {
    const adminContext = await blogSchema.context(dataAdapter, {user: blogAdminUser});
    const users = await adminContext
      .select(User)
      .where({count: 2})
      .where({count: 14});
    expect(users).toEqual([]);
  });

  it('should execute select(User).skip(1)', async () => {
    const adminContext = await blogSchema.context(dataAdapter, {user: blogAdminUser});
    const users = await adminContext
      .select(User)
      .skip(1)
      .orderBy(u => u.name);
    expect(users).toEqual([userA]);
  });

  it('should execute select(User).where({count: 99}).firstOrDefault()', async () => {
    const adminContext = await blogSchema.context(dataAdapter, {user: blogAdminUser});
    const user = await adminContext
      .select(User)
      .where({count: 99})
      .firstOrDefault();
    expect(user).toEqual(null);
  });

  it('should execute select(User).where({count: {$lt: 2}})', async () => {
    const adminContext = await blogSchema.context(dataAdapter, {user: blogAdminUser});
    const users = await adminContext
      .select(User)
      .where({count: {$lt: 2}});
    expect(users).toEqual([]);
  });

  it('should execute select(User).where({count: {$lte: 2}})', async () => {
    const adminContext = await blogSchema.context(dataAdapter, {user: blogAdminUser});
    const users = await adminContext
      .select(User)
      .where({count: {$lte: 2}});
    expect(users).toEqual([userA]);
  });

  it('should execute select(User).where({name: {$in: [foo, bar]}})', async () => {
    const adminContext = await blogSchema.context(dataAdapter, {user: blogAdminUser});
    const users = await adminContext
      .select(User)
      .where({name: {$in: ['foo', 'bar']}});
    expect(users).toEqual([userA, userB]);
  });

  it('should execute select(User).where({name: {$nin: [foo, bar]}})', async () => {
    const adminContext = await blogSchema.context(dataAdapter, {user: blogAdminUser});
    const users = await adminContext
      .select(User)
      .where({name: {$nin: ['foo', 'bar']}});
    expect(users).toEqual([]);
  });

  it('should execute select(User).where({name: {$ne: foo}})', async () => {
    const adminContext = await blogSchema.context(dataAdapter, {user: blogAdminUser});
    const users = await adminContext
      .select(User)
      .where({name: {$ne: 'foo'}});
    expect(users).toEqual([userB]);
  });

  it('should execute count(User)', async () => {
    const adminContext = await blogSchema.context(dataAdapter, {user: blogAdminUser});
    const count = await adminContext.select(User).count();
    expect(count).toEqual(2);
  });


  it('should execute select(User)', async () => {
    const adminContext = await blogSchema.context(dataAdapter, {user: blogAdminUser});
    const result = await adminContext
      .select(User)
      .where({count: 14})
      .count();

    expect(result).toEqual(1);
  });

  it('should execute select(User).include(parent)', async () => {
    const adminContext = await blogSchema.context(dataAdapter, {user: blogAdminUser});
    const users = await adminContext
      .select(User)
      .include(u => u.parent);
    expect(users).toEqual([userA, {
      ...userB, parent: {
        id: 'a',
        name: 'foo',
        count: 2,
        admin: true,
        parentId: null,
      },
    }]);
  });

  it('should execute select(User).orderBy(name).orderBy(count)', async () => {
    const adminContext = await blogSchema.context(dataAdapter, {user: blogAdminUser});
    const users = await adminContext
      .select(User)
      .orderBy(u => u.name)
      .orderBy(u => u.count);
    expect(users).toEqual([userB, userA]);
  });

  it('should execute select(User).orderBy(name).orderBy(count).where({name: foobar})', async () => {
    const adminContext = await blogSchema.context(dataAdapter, {user: blogAdminUser});
    const users = await adminContext
      .select(User)
      .orderBy(u => u.name)
      .orderBy(u => u.count)
      .where({name: 'foobar'});
    expect(users).toEqual([]);
  });
});
