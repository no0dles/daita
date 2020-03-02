import {RelationalDataAdapterFactory, SchemaTest} from '../test/test-utils';
import {relationalDeleteContextTest} from '../context/relational-delete-context.test';
import {relationalInsertContextTest} from '../context/relational-insert-context.test';
import {relationalSelectContext} from '../context/relational-select-context.test';
import {relationalTransactionRemoteTest, relationalTransactionTest} from '../context/relational-transaction.test';
import {relationalUpdateContextTest} from '../context/relational-update-context.test';
import {RelationalTransactionAdapter} from './relational-transaction-adapter';
import {blogSchema} from '../test/schemas/blog/schema';
import {blogAdminUser, blogViewUser} from '../test/schemas/blog/users';
import {RelationalTransactionContext} from '../context';

export function relationalDataAdapterTest(adapterFactory: RelationalDataAdapterFactory<RelationalTransactionAdapter>, options: { remote: boolean }) {
  describe('relational-data-adapter', () => {
    let schema: SchemaTest<RelationalTransactionAdapter>;

    const testContext: { adminContext: RelationalTransactionContext, viewerContext: RelationalTransactionContext } = {} as any;

    beforeAll(async () => {
      schema = new SchemaTest(blogSchema, adapterFactory);
      testContext.adminContext = await schema.getContext({user: blogAdminUser}) as RelationalTransactionContext;
      testContext.viewerContext = await schema.getContext({user: blogViewUser}) as RelationalTransactionContext;
    });

    afterAll(async () => {
      await schema.close();
    });

    // it('should raw', async() => {
    //   const date = await adapterTest.dataAdapter.raw('SELECT now() as date', []);
    //   expect(date.rowCount).to.be.eq(1);
    //   expect(date.rows[0].date).to.not.be.eq(null);
    //   expect(date.rows[0].date).to.not.be.eq(undefined);
    // });
    //
    // it('should return raw error', async () => {
    //   try {
    //     await adapterTest.dataAdapter.raw('SELECT foo as date', []);
    //   } catch (e) {
    //     expect(e.message).to.be.eq('column "foo" does not exist');
    //   }
    // });

    relationalDeleteContextTest(testContext);
    relationalInsertContextTest(testContext);
    relationalSelectContext(testContext);
    relationalUpdateContextTest(testContext);
    relationalTransactionTest(testContext);
    if (options.remote) {
      relationalTransactionRemoteTest(testContext);
    }
  });
}