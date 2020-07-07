import { testAdapter } from '../../adapters';
import { all, field, getClient, notBetween, SelectSql, table } from '@daita/relational';
import { seed } from '../../seed';

describe('not-between', () => {
  class Test {
    value!: number;
  }

  beforeAll(async () => {
    await seed(
      Test,
      [{ name: 'value', primaryKey: true, type: 'number', notNull: false }],
      [{ value: 2 }, { value: 4 }, { value: 6 }],
    );
  });

  describe('should select with not between condition', testAdapter(async (adapter) => {
    const sql: SelectSql<any> = {
      select: all(Test),
      from: table(Test),
      where: notBetween(field(Test, 'value'), 3, 6),
      orderBy: field(Test, 'value'),
    };
    const client = getClient(adapter);
    const results = await client.select(sql);
    expect(results).toEqual([{ value: 2 }]);
  }));
});
