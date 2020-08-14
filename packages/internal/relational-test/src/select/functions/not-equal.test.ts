import { testAdapter } from '../../adapters';
import { all, field, getClient, notEqual, SelectSql, table } from '@daita/relational';
import { seed } from '../../seed';
import { RelationalTest } from '../../relational-test';

export function notEqualTest(arg: RelationalTest) {
  describe('not-equal', () => {
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

    describe('should select with not equal condition', testAdapter(arg, async (adapter) => {
      const sql: SelectSql<any> = {
        select: all(Test),
        from: table(Test),
        where: notEqual(field(Test, 'value'), 'test'),
        orderBy: field(Test, 'value'),
      };
      const client = getClient(adapter);
      const results = await client.select(sql);
      expect(results).toEqual([{value: 'bar'}, {value: 'foo'}]);
    }));
  });

}
