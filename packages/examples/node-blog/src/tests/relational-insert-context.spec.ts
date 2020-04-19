import {User} from '../test/schemas/blog/models/user';
import {blogAdminUser} from '../test/schemas/blog/users';

describe('relational-insert-context', () => {
  it('should execute insert(User).value(id: a, name: foo, count: 2, admin: true)', async () => {
    await testInsert({id: 'a', name: 'foo', count: 2, admin: true});
  });

  it('should execute insert(User).value(id: a, name: foo, count: null, admin: true)', async () => {
    await testInsert({id: 'a', name: 'foo', count: null, admin: true});
  });

  it('should not execute insert(User).value(id: a, name: null, count: null, admin: false)', async () => {
    await testFailInsert(
      {
        id: 'a',
        name: null,
        count: null,
        admin: false,
      },
      'name is required',
    );
  });

  async function testInsert(user: any) {
    const adminContext = await schema.getContext({user: blogAdminUser});
    await adminContext
      .insert(User)
      .value(user);
  }

  async function testFailInsert(user: any, message: string) {
    await expect(testInsert(user)).rejects.toThrow(message);
  }
});
