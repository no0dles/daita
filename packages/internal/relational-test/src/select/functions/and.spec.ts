import { testAdapter } from '../../adapters';
import { all, and, field, getClient, notEqual, SelectSql, table } from '@daita/relational';
import { seed } from '../../seed';
import { RelationalTest } from '../../relational-test';

export function andTest(arg: RelationalTest) {
  describe('and', () => {
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

    describe('should select with and condition', testAdapter(arg, async (adapter) => {
      const sql: SelectSql<any> = {
        select: all(Test),
        from: table(Test),
        where: and(
          notEqual(field(Test, 'value'), 'test'),
          notEqual(field(Test, 'value'), 'foo')
        )
      };
      const client = getClient(adapter);
      const result = await client.selectFirst(sql);
      expect(result).toEqual({ value: 'bar' });
    }));
  });

}
