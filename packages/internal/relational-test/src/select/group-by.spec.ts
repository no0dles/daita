import { testAdapter } from '../adapters';
import { count, desc, field, getClient, SelectSql, table } from '@daita/relational';
import { seed } from '../seed';
import { RelationalTest } from '../relational-test';

export function groupByTest(arg: RelationalTest) {
  describe('group-by', () => {
    class Test {
      id!: string;
      value!: string;
    }

    beforeAll(async () => {
      await seed(arg,
        Test,
        [{ name: 'id', primaryKey: true, type: 'string', notNull: false },
          { name: 'value', primaryKey: true, type: 'string', notNull: false }],
        [{ id: 'a', value: 'foo' }, { id: 'b', value: 'foo' }, { id: 'c', value: 'bar' }],
      );
    });

    describe('should select with group by', testAdapter(arg,async (adapter) => {
      const sql: SelectSql<any> = {
        select: {
          count: count(),
          value: field(Test, 'value'),
        },
        from: table(Test),
        groupBy: field(Test, 'value'),
        orderBy: desc(count()),
      };
      const client = getClient(adapter);
      const results = await client.select(sql);
      expect(results).toEqual([{ value: 'foo', count: 2 }, { value: 'bar', count: 1 }]);
    }));
  });

}
