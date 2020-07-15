import { testAdapter } from '../../adapters';
import { field, getClient, isNull, SelectSql, table } from '@daita/relational';
import { seed } from '../../seed';
import { RelationalTest } from '../../relational-test';

export function isNullTest(arg: RelationalTest) {
  describe('is-null', () => {
    class Test {
      value!: number;
    }

    beforeAll(async () => {
      await seed(arg,
        Test,
        [{ name: 'value', primaryKey: false, type: 'number', notNull: false }],
        [{ value: 1 }, { value: null }, { value: 22 }],
      );
    });

    describe('should select with where isNull', testAdapter(arg, async (adapter) => {
      const sql: SelectSql<any> = {
        select: field(Test, 'value'),
        from: table(Test),
        where: isNull(field(Test, 'value')),
      };
      const client = getClient(adapter);
      const results = await client.select(sql);
      expect(results).toEqual([null]);
    }));
  });

}
