import { testAdapter } from '../../adapters';
import { alias, count, desc, equal, field, getClient, SelectSql, subSelect, table } from '@daita/relational';
import { seed } from '../../seed';
import { RelationalTest } from '../../relational-test';

export function subSelectTest(arg: RelationalTest) {
  describe('sub-select', () => {
    class Test {
      id!: string;
      value!: string;
    }

    beforeAll(async () => {
      await seed(arg,
        Test,
        [{ name: 'id', primaryKey: true, type: 'string', notNull: false },
          { name: 'value', primaryKey: true, type: 'string', notNull: false }],
        [{ id: 'a', value: 'foo' }, { id: 'b', value: 'foo' }, { id: 'c', value: 'bar' }],
      );
    });

    describe('should select with sub select', testAdapter(arg,async (adapter) => {
      const sql: SelectSql<any> = {
        select: {
          value: field(Test, 'value'),
          cnt: subSelect({
            select: count(),
            from: alias(Test, 's'),
            where: equal(field(alias(Test, 's'), 'value'), field(Test, 'value')),
          })
        },
        from: table(Test),
        orderBy: desc(2),
      };
      const client = getClient(adapter);
      const results = await client.select(sql);
      expect(results).toEqual([{ value: 'foo', cnt: 2 }, { value: 'foo', cnt: 2 }, { value: 'bar', cnt: 1 }]);
    }));
  });

}
