import { testAdapter } from '../../adapters';
import { getClient, now, SelectSql, table } from '@daita/relational';
import { seed } from '../../seed';
import { RelationalTest } from '../../relational-test';

export function nowTest(arg: RelationalTest) {
  describe('now', () => {
    class Test {
      id!: string;
    }

    beforeAll(async () => {
      await seed(arg,
        Test,
        [
          { name: 'id', primaryKey: true, type: 'string', notNull: false },
        ],
        [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
      );
    });

    describe('should select with now', testAdapter(arg,async (adapter) => {
      const sql: SelectSql<Date> = {
        select: now(),
        from: table(Test),
      };
      const client = getClient(adapter);
      const results = await client.selectFirst(sql);
      expect(results).toBeInstanceOf(Date);
    }));
  });

}
