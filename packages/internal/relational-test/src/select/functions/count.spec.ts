import { testAdapter } from '../../adapters';
import { count, field, getClient, like, SelectSql, table } from '@daita/relational';
import { seed } from '../../seed';
import { RelationalTest } from '../../relational-test';

export function countTest(arg: RelationalTest) {
  describe('count', () => {
    class Test {
      value!: string;
    }

    beforeAll(async () => {
      await seed(arg,
        Test,
        [{ name: 'value', primaryKey: true, type: 'string', notNull: false }],
        [{ value: 'foobar' }, { value: 'foo' }, { value: 'bar' }],
      );
    });

    describe('should select count', testAdapter(arg, async (adapter) => {
      const sql: SelectSql<any> = {
        select: count(),
        from: table(Test),
        where: like(field(Test, 'value'), 'foo%'),
      };
      const client = getClient(adapter);
      const results = await client.selectFirst(sql);
      expect(results).toEqual(2);
    }));
  });

}
