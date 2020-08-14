import { testAdapter } from '../../adapters';
import { asc, field, getClient, like, SelectSql, table } from '@daita/relational';
import { seed } from '../../seed';
import { RelationalTest } from '../../relational-test';

export function likeTest(arg: RelationalTest) {
  describe('like', () => {
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

    describe('should select with where isNull', testAdapter(arg,async (adapter) => {
      const sql: SelectSql<any> = {
        select: field(Test, 'value'),
        from: table(Test),
        where: like(field(Test, 'value'), 'foo%'),
        orderBy: asc(field(Test, 'value')),
      };
      const client = getClient(adapter);
      const results = await client.select(sql);
      expect(results).toEqual(['foo', 'foobar']);
    }));
  });
}
