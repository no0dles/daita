import { testAdapter } from '../../adapters';
import { field, getClient, SelectSql, table, greaterEqualThan } from '@daita/relational';
import { seed } from '../../seed';
import { RelationalTest } from '../../relational-test';

export function greaterEqualThanTest(arg: RelationalTest) {
  describe('greater-equal-than', () => {
    class Test {
      value!: number;
    }

    beforeAll(async () => {
      await seed(arg,
        Test,
        [{ name: 'value', primaryKey: true, type: 'number', notNull: false }],
        [{ value: 2 }, { value: 4 }],
      );
    });

    describe('should select greater than', testAdapter(arg, async (adapter) => {
      const sql: SelectSql<any> = {
        select: field(Test, 'value'),
        from: table(Test),
        where: greaterEqualThan(field(Test, 'value'), 3),
      };
      const client = getClient(adapter);
      const results = await client.select(sql);
      expect(results).toEqual([4]);
    }));
  });

}
