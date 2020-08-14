import { testAdapter } from '../../adapters';
import { alias, asc, equal, field, getClient, join, like, SelectSql, table } from '@daita/relational';
import { seed } from '../../seed';
import { RelationalTest } from '../../relational-test';

export function joinTest(arg: RelationalTest) {
  describe('join', () => {
    class Test {
      id!: string;
      value!: string;
    }

    beforeAll(async () => {
      await seed(arg,
        Test,
        [
          { name: 'id', primaryKey: true, type: 'string', notNull: false },
          { name: 'value', primaryKey: false, type: 'string', notNull: false },
        ],
        [{ id: 'a', value: 'b' }, { id: 'b', value: 'c' }, { id: 'c', value: null }],
      );
    });

    describe('should select with join', testAdapter(arg, async (adapter) => {
      const sql: SelectSql<any> = {
        select: { val: field(Test, 'value'), joinedVal: field(alias(Test, 'j'), 'value') },
        from: table(Test),
        join: [join(alias(Test, 'j'), equal(field(Test, 'value'), field(alias(Test, 'j'), 'id')))],
        where: equal(field(Test, 'id'), 'a'),
      };
      const client = getClient(adapter);
      const results = await client.select(sql);
      expect(results).toEqual([{ val: 'b', joinedVal: 'c' }]);
    }));
  });

}
