import {RelationalDataAdapterFactory, SchemaTest} from '../test/test-utils';
import {RelationalContext} from './relational-context';
import {blogSchema} from '../test/schemas/blog/schema';
import {blogAdminUser} from '../test/schemas/blog/users';
import {User} from '../test/schemas/blog/models/user';

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

export function relationalUpdateContextTest(adapterFactory: RelationalDataAdapterFactory) {
  describe('relational-update-context', () => {
    let schema: SchemaTest;
    let adminContext: RelationalContext;

    beforeEach(async () => {
      schema = new SchemaTest(blogSchema, adapterFactory);
      adminContext = await schema.getContext({user: blogAdminUser});

      await adminContext.migration().apply();
      await adminContext
        .insert(User)
        .value(userA)
        .exec();
      await adminContext
        .insert(User)
        .value(userB)
        .exec();
    });

    afterEach(async () => {
      await schema.close();
    });

    it('should update(User).set(name: bar).where(id: a)', async () => {
      const result = await adminContext
        .update(User)
        .set({name: 'bar'})
        .where({id: 'a'})
        .exec();
      expect(result).toEqual({affectedRows: 1});
      const serverUsers = await adminContext
        .select(User)
        .orderBy(s => s.id)
        .exec();
      expect(serverUsers).toEqual([
        {...userA, name: 'bar'},
        userB,
      ]);
    });
  });
}