import { testAdapter } from '../../adapters';
import { all, getClient, SelectSql, table } from '@daita/relational';
import { seed } from '../../seed';
import { RelationalTest } from '../../relational-test';

export function allTest(arg: RelationalTest) {
  describe('all', () => {
    class Test {
      value!: string;
    }

    beforeAll(async () => {
      await seed(arg,
        Test,
        [{ name: 'value', primaryKey: true, type: 'string', notNull: false }],
        [{ value: 'test' }],
      );
    });

    describe('should select all from table', testAdapter(arg, async (adapter) => {
      const sql: SelectSql<any> = {
        select: all(Test),
        from: table(Test),
      };
      const client = getClient(adapter);
      const result = await client.selectFirst(sql);
      expect(result).toEqual({ value: 'test' });
    }));
  });

}
