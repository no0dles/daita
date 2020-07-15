import { testAdapter } from '../../adapters';
import { field, getClient, SelectSql, sum, table } from '@daita/relational';
import { seed } from '../../seed';
import { RelationalTest } from '../../relational-test';

export function sumTest(arg: RelationalTest) {
  describe('sum', () => {
    class Test {
      value!: number;
      name!: string;
    }

    beforeAll(async () => {
      await seed(arg,
        Test,
        [
          { name: 'value', primaryKey: true, type: 'number', notNull: false },
          { name: 'name', primaryKey: true, type: 'string', notNull: false },
        ],
        [{ value: 4, name: 'a' }, { value: 2, name: 'a' }, { value: 6, name: 'b' }],
      );
    });

    describe('should select sum', testAdapter(arg, async (adapter) => {
      const sql: SelectSql<any> = {
        select: { value: sum(Test, 'value'), name: field(Test, 'name') },
        from: table(Test),
        groupBy: field(Test, 'name'),
      };
      const client = getClient(adapter);
      const results = await client.select(sql);
      expect(results).toEqual([{ name: 'a', value: 6 }, { name: 'b', value: 6 }]);
    }));
  });

}
