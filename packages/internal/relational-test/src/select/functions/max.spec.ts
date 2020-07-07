import { testAdapter } from '../../adapters';
import { getClient, max, min, SelectSql, table } from '@daita/relational';
import { seed } from '../../seed';

describe('max', () => {
  class Test {
    value!: number;
  }

  beforeAll(async () => {
    await seed(
      Test,
      [{ name: 'value', primaryKey: true, type: 'number', notNull: false }],
      [{ value: 4 }, { value: 2 }, { value: 6 }],
    );
  });

  describe('should select max', testAdapter(async (adapter) => {
    const sql: SelectSql<any> = {
      select: max(Test, 'value'),
      from: table(Test),
    };
    const client = getClient(adapter);
    const results = await client.selectFirst(sql);
    expect(results).toEqual(6);
  }));
});
