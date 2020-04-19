import {blogSchema} from '../schema';
import {blogAdminUser} from '../users';
import {User} from '../models/user';
import {getTestAdapter, migrate, seed} from './seed';
import {RelationalDataAdapter} from '@daita/core';

describe('relational-insert-context', () => {
  const dataAdapter = getTestAdapter();

  beforeAll(() => migrate(dataAdapter, blogSchema));
  beforeEach(async () => await seed(dataAdapter, blogSchema).clear(User));

  it('should execute insert(User).value(id: a, name: foo, count: 2, admin: true)', async() => {
    await testInsert(dataAdapter, {id: 'a', name: 'foo', count: 2, admin: true});
  });

  it('should execute insert(User).value(id: a, name: foo, count: null, admin: true)', async() => {
    await testInsert(dataAdapter, {id: 'a', name: 'foo', count: null, admin: true});
  });

  it('should not execute insert(User).value(id: a, name: null, count: null, admin: false)', async() => {
    await testFailInsert(dataAdapter,
      {
        id: 'a',
        name: null,
        count: null,
        admin: false,
      },
      'name is required',
    );
  });

  async function testInsert(dataAdapter: RelationalDataAdapter, user: any) {
    const adminContext = await blogSchema.context(dataAdapter, {user: blogAdminUser});
    await adminContext
      .insert(User)
      .value(user);
  }

  async function testFailInsert(dataAdapter: RelationalDataAdapter, user: any, message: string) {
    await expect(testInsert(dataAdapter, user)).rejects.toThrow(message);
  }
});
