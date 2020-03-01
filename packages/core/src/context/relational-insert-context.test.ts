import {RelationalDataAdapterFactory, SchemaTest} from '../test/test-utils';
import {RelationalContext} from './relational-context';
import {blogSchema} from '../test/schemas/blog/schema';
import {blogAdminUser} from '../test/schemas/blog/users';
import {User} from '../test/schemas/blog/models/user';

export function relationalInsertContextTest(adapterFactory: RelationalDataAdapterFactory) {
  describe('relational-insert-context', () => {
    let schema: SchemaTest;
    let adminContext: RelationalContext;

    beforeEach(async () => {
      schema = new SchemaTest(blogSchema, adapterFactory);
      adminContext = await schema.getContext({user: blogAdminUser});
      await adminContext.migration().apply();
    });

    afterEach(async () => {
      await schema.close();
    });

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
      await adminContext
        .insert(User)
        .value(user)
        .exec();
    }

    async function testFailInsert(user: any, message: string) {
      await expect(testInsert(user)).rejects.toThrow(message);
    }
  });
}
