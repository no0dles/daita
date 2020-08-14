import { testAdapter } from '../../adapters';
import { alias, field, getClient, SelectSql } from '@daita/relational';
import { seed } from '../../seed';
import { RelationalTest } from '../../relational-test';

export function aliasTest(arg: RelationalTest) {
  describe('alias', () => {
    class Test {
      value!: string;
    }

    beforeAll(async() => {
      await seed(arg,
        Test,
        [{name: 'value', primaryKey: true, type: 'string', notNull: false}],
        [{ value: 'test' }]
      );
    });

    describe('should select value from table alias', testAdapter(arg, async (adapter) => {
      const sql: SelectSql<any> = {
        select: {
          value: field(alias(Test, 't'), 'value'),
        },
        from: alias(Test, 't')
      };
      const client = getClient(adapter);
      const result = await client.selectFirst(sql);
      expect(result).toEqual({ value: 'test' });
    }));
  });

}
