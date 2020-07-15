import { testAdapter } from '../adapters';
import { all, asc, desc, field, getClient, SelectSql, table } from '@daita/relational';
import { seed } from '../seed';
import { RelationalTest } from '../relational-test';

export function orderByTest(arg: RelationalTest) {

  describe('order-by', () => {
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

    describe('should select with order by without asc/desc', testAdapter(arg, async (adapter) => {
      const sql: SelectSql<any> = {
        select: all(Test),
        from: table(Test),
        orderBy: field(Test, 'value'),
        limit: 1,
      };
      const client = getClient(adapter);
      const results = await client.select(sql);
      expect(results).toEqual([{ value: 'bar' }]);
    }));

    describe('should select with order by with asc', testAdapter(arg, async (adapter) => {
      const sql: SelectSql<any> = {
        select: all(Test),
        from: table(Test),
        orderBy: asc(field(Test, 'value')),
        limit: 1,
      };
      const client = getClient(adapter);
      const results = await client.select(sql);
      expect(results).toEqual([{ value: 'bar' }]);
    }));

    describe('should select with order by with desc', testAdapter(arg,async (adapter) => {
      const sql: SelectSql<any> = {
        select: all(Test),
        from: table(Test),
        orderBy: desc(field(Test, 'value')),
        limit: 1,
      };
      const client = getClient(adapter);
      const results = await client.select(sql);
      expect(results).toEqual([{ value: 'test' }]);
    }));
  });

}
