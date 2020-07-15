import { testAdapter } from '../adapters';
import { all, field, getClient, SelectSql, table } from '@daita/relational';
import { seed } from '../seed';
import { RelationalTest } from '../relational-test';

export function offsetTest(arg: RelationalTest) {
  describe('offset', () => {
    class Test {
      value!: string;
    }

    beforeAll(async() => {
      await seed(arg,
        Test,
        [{name: 'value', primaryKey: true, type: 'string', notNull: false}],
        [{ value: 'test' }, { value: 'foo' }, { value: 'bar' }]
      );
    });

    describe('should select with offset', testAdapter(arg, async (adapter) => {
      const sql: SelectSql<any> = {
        select: all(Test),
        from: table(Test),
        orderBy: field(Test, 'value'),
        limit: 1,
        offset: 1,
      };
      const client = getClient(adapter);
      const results = await client.select(sql);
      expect(results).toEqual([{value: 'foo'}]);
    }));
  });

}
