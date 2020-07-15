import { testAdapter } from '../../adapters';
import { alias, all, and, equal, exists, field, getClient, or, SelectSql, subSelect, table } from '@daita/relational';
import { seed } from '../../seed';
import { RelationalTest } from '../../relational-test';

export function existsTest(arg: RelationalTest) {
  describe('exists', () => {
    class Test {
      value!: string;
    }

    beforeAll(async () => {
      await seed(arg,
        Test,
        [{ name: 'value', primaryKey: true, type: 'string', notNull: false }],
        [{ value: 'test' }, { value: 'foo' }, { value: 'bar' }],
      );
    });

    describe('should select with exists condition', testAdapter(arg,async (adapter) => {
      const sql: SelectSql<any> = {
        select: all(Test),
        from: table(Test),
        where: exists({
          select: field(alias(Test, 't'), 'value'),
          from: alias(Test, 't'),
          where: and(
            equal(field(alias(Test, 't'), 'value'), 'foo'),
            equal(field(Test, 'value'), field(alias(Test, 't'), 'value')),
          ),
        }),
      };
      const client = getClient(adapter);
      const results = await client.select(sql);
      expect(results).toEqual([{ value: 'foo' }]);
    }));
  });
}
