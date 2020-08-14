import { testAdapter } from '../../adapters';
import { concat, field, getClient, SelectSql, table } from '@daita/relational';
import { seed } from '../../seed';
import { RelationalTest } from '../../relational-test';

export function concatTest(arg: RelationalTest) {
  describe('concat', () => {
    class Test {
      value!: string;
    }

    beforeAll(async () => {
      await seed(arg,
        Test,
        [{ name: 'value', primaryKey: true, type: 'string', notNull: false }],
        [{ value: 'foo' }, { value: 'bar' }],
      );
    });

    describe('should select with concat', testAdapter(arg, async (adapter) => {
      const sql: SelectSql<any> = {
        select: concat(field(Test, 'value'), 'bar'),
        from: table(Test),
      };
      const client = getClient(adapter);
      const results = await client.select(sql);
      expect(results).toEqual(['foobar', 'barbar']);
    }));
  });

}
