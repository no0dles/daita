import { clientTest } from '../../../../../../testing/relational/client-test';
import { table } from '../../../keyword/table/table';
import { field } from '../../../keyword/field/field';

describe(
  'alter-table',
  clientTest((adapterFn) => {
    class TestTable {
      static table = 'test';
      id!: number;
      name!: string;
    }

    it('should alter table', async () => {
      const client = adapterFn();
      await client.exec({
        createTable: table(TestTable),
        columns: [{ name: 'id', notNull: true, primaryKey: true, type: 'number' }],
      });
      await client.exec({
        alterTable: table(TestTable),
        add: { column: 'name', type: 'string' },
      });
      await client.select({
        select: field(TestTable, 'name'),
        from: table(TestTable),
      });
    });
  }),
);
