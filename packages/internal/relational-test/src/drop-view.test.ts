import { getClient, table, all } from '@daita/relational';
import { RelationalTest } from './relational-test';
import { testAdapter } from './adapters';

export function dropViewTest(arg: RelationalTest) {
  describe('drop-view', () => {
    describe('should drop view', testAdapter(arg, async (adapter) => {

      const client = getClient(adapter);
      await adapter.exec({
        dropTable: table('Base'),
        ifExists: true,
      });
      await client.exec({
        createTable: table('Base'),
        columns: [{
          name: 'test', type: 'string',
          notNull: false,
          primaryKey: true,
        }],
      });
      await client.exec({
        createView: table('TestView'),
        orReplace: true,
        as: {
          select: all(),
          from: table('Base'),
        },
      });
      await client.exec({
        dropView: table('TestView'),
      });
    }));
  });
}
