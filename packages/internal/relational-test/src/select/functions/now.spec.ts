import { testAdapter } from '../../adapters';
import { getClient, now, SelectSql, table } from '@daita/relational';
import { seed } from '../../seed';

describe('now', () => {
  class Test {
    id!: string;
  }

  beforeAll(async () => {
    await seed(
      Test,
      [
        { name: 'id', primaryKey: true, type: 'string', notNull: false },
      ],
      [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
    );
  });

  describe('should select with now', testAdapter(async (adapter) => {
    const sql: SelectSql<Date> = {
      select: now(),
      from: table(Test),
    };
    const client = getClient(adapter);
    const results = await client.selectFirst(sql);
    expect(results).toBeInstanceOf(Date);
  }));
});
