import {blogSchema} from '../schema';
import {getTestAdapter, migrate, seed, userA, userB} from './seed';
import {blogAdminUser} from '../users';
import {User} from '../models/user';

describe('relational-update-context', () => {
  const dataAdapter = getTestAdapter();

  beforeAll(() => migrate(dataAdapter, blogSchema));
  beforeEach(async () => await seed(dataAdapter, blogSchema).clear(User).table(User, [userA, userB]));

  it('should update(User).set(name: bar).where(id: a)', async () => {
    const adminContext = await blogSchema.context(dataAdapter, {user: blogAdminUser});
    const result = await adminContext
      .update(User)
      .set({name: 'bar'})
      .where({id: 'a'});
    expect(result).toEqual({affectedRows: 1});
    const serverUsers = await adminContext
      .select(User)
      .orderBy(s => s.id);
    expect(serverUsers).toEqual([
      {...userA, name: 'bar'},
      userB,
    ]);
  });
});
