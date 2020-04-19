import {User} from '../test/schemas/blog/models/user';
import {blogAdminUser} from '../test/schemas/blog/users';

describe('relational-delete-context', () => {
  it('should execute delete(User).where(id: b)', async () => {
    const adminContext = await schema.getContext({user: blogAdminUser});
    const result = await adminContext
      .delete(User)
      .where({id: 'b'});
    expect(result).toEqual({affectedRows: 1});
    const serverUsers = await adminContext.select(User);
    expect(serverUsers).toEqual([userA]);
  });
});
