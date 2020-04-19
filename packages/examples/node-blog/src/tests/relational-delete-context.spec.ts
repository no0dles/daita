import {getTestAdapter, migrate, seed, userA, userB} from './seed';
import {blogSchema} from '../schema';
import {blogAdminUser} from '../users';
import {User} from '../models/user';

describe('relational-delete-context', () => {
  const dataAdapter = getTestAdapter();

  beforeAll(() => migrate(dataAdapter, blogSchema));
  beforeEach(async () => await seed(dataAdapter, blogSchema).clear(User).table(User, [userA, userB]));

  it('should execute delete(User).where(id: b)', async () => {
    const adminContext = await blogSchema.context(dataAdapter, {user: blogAdminUser});
    const result = await adminContext
      .delete(User)
      .where({id: 'b'});
    expect(result).toEqual({affectedRows: 1});
    const serverUsers = await adminContext.select(User);
    expect(serverUsers).toEqual([userA]);
  });
});
