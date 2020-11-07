import { adapterTest } from '../adapter-test';
import { table } from '../../packages/relational/sql/function/table';
import { field } from '../../packages/relational/sql/function/field';

describe(
  'adapter/create-table',
  adapterTest((adapterFn) => {
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
        await adapter.exec({
          insert: { id: 1 },
          into: table(TestTable),
        });
        const res = await adapter.exec({
          select: {
            id: field(table(TestTable), 'id'),
          },
          from: table(TestTable),
        });
        expect(res.rowCount).toBe(1);
        expect(res.rows[0]).toEqual({ id: 1 });
      });
    });
  }),
);
