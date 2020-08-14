import { testAdapter } from '../../adapters';
import { avg, getClient, SelectSql, table } from '@daita/relational';
import { seed } from '../../seed';
import { RelationalTest } from '../../relational-test';

export function avgTest(arg: RelationalTest) {
  describe('avg', () => {
    class Test {
      value!: number;
    }

    beforeAll(async () => {
      await seed(arg,
        Test,
        [{ name: 'value', primaryKey: true, type: 'number', notNull: false }],
        [{ value: 1 }, { value: 11 }],
      );
    });

    describe('should select avg', testAdapter(arg,async (adapter) => {
      const sql: SelectSql<any> = {
        select: avg(Test, 'value'),
        from: table(Test),
      };
      const client = getClient(adapter);
      const results = await client.selectFirst(sql);
      expect(results).toEqual(6);
    }));
  });

}
