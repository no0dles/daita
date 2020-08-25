import { testAdapter } from '../../adapters';
import { getClient, min, SelectSql, table } from '@daita/relational';
import { seed } from '../../seed';
import { RelationalTest } from '../../relational-test';

export function minTest(arg: RelationalTest) {
  describe('min', () => {
    class Test {
      value!: number;
    }

    beforeAll(async () => {
      await seed(arg,
        Test,
        [{ name: 'value', primaryKey: true, type: 'number', notNull: false }],
        [{ value: 4 }, { value: 2 }, { value: 6 }],
      );
    });

    describe('should select min', testAdapter(arg,async (adapter) => {
      const sql: SelectSql<any> = {
        select: min(Test, 'value'),
        from: table(Test),
      };
      const client = getClient(adapter);
      const results = await client.selectFirst(sql);
      expect(results).toEqual(2);
    }));
  });
}