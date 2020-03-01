import {RelationalDataAdapterFactory} from '../test/test-utils';
import {relationalDeleteContextTest} from '../context/relational-delete-context.test';
import {relationalInsertContextTest} from '../context/relational-insert-context.test';
import {relationalSelectContext} from '../context/relational-select-context.test';
import {relationalTransactionTest} from '../context/relational-transaction.test';
import {relationalUpdateContextTest} from '../context/relational-update-context.test';
import {relationalContextTest} from '../context/relational-context.test';

export function relationalDataAdapterTest(adapterFactory: RelationalDataAdapterFactory) {
  describe('relational-data-adapter', () => {
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

    relationalDeleteContextTest(adapterFactory);
    relationalInsertContextTest(adapterFactory);
    relationalSelectContext(adapterFactory);
    relationalUpdateContextTest(adapterFactory);
    relationalTransactionTest(adapterFactory);
  });
}