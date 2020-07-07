import { testAdapter } from '../../adapters';
import { field, getClient, greaterThan, SelectSql, table } from '@daita/relational';
import { seed } from '../../seed';

describe('greater-than', () => {
  class Test {
    value!: number;
  }

  beforeAll(async () => {
    await seed(
      Test,
      [{ name: 'value', primaryKey: true, type: 'number', notNull: false }],
      [{ value: 2 }, { value: 4 }],
    );
  });

  describe('should select greater than', testAdapter(async (adapter) => {
    const sql: SelectSql<any> = {
      select: field(Test, 'value'),
      from: table(Test),
      where: greaterThan(field(Test, 'value'), 2),
    };
    const client = getClient(adapter);
    const results = await client.select(sql);
    expect(results).toEqual([4]);
  }));
});
