import { table } from '../../keyword/table/table';
import { field } from '../../keyword/field/field';
import { clientTest } from '../../../../../testing/relational/client-test';

describe(
  'adapter/create-table',
  clientTest((adapterFn) => {
    class TestTable {
      static table = 'test';
      id!: number;
    }

    it('should create table with id', async () => {
      const adapter = adapterFn();
      await adapter.exec({
        createTable: table(TestTable),
        columns: [{ name: 'id', notNull: true, primaryKey: true, type: 'number' }],
      });
      await adapter.transaction(async () => {
        await adapter.insert({
          insert: { id: 1 },
          into: table(TestTable),
        });
        const res = await adapter.select({
          select: {
            id: field(table(TestTable), 'id'),
          },
          from: table(TestTable),
        });
        expect(res).toHaveLength(1);
        expect(res[0]).toEqual({ id: 1 });
      });
    });
  }),
);
