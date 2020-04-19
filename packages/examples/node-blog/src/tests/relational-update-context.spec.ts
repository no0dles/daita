import {User} from '../test/schemas/blog/models/user';
import {blogAdminUser} from '../test/schemas/blog/users';

describe('relational-update-context', () => {
  it('should update(User).set(name: bar).where(id: a)', async () => {
    const adminContext = await schema.getContext({user: blogAdminUser});
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
