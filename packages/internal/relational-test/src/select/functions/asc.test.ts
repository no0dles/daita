import { testAdapter } from '../../adapters';
import { asc, field, getClient, SelectSql, table } from '@daita/relational';
import { seed } from '../../seed';
import { RelationalTest } from '../../relational-test';

export function ascTest(arg: RelationalTest) {
  describe('asc', () => {
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

    describe('should select order by asc', testAdapter(arg,async (adapter) => {
      const sql: SelectSql<any> = {
        select: field(Test, 'value'),
        from: table(Test),
        orderBy: asc(field(Test, 'value')),
      };
      const client = getClient(adapter);
      const results = await client.select(sql);
      expect(results).toEqual(['bar', 'foo']);
    }));
  });

}
