import { testAdapter } from '../../adapters';
import { all, between, field, getClient, SelectSql, table } from '@daita/relational';
import { seed } from '../../seed';

describe('between', () => {
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

  describe('should select with between condition', testAdapter(async (adapter) => {
    const sql: SelectSql<any> = {
      select: all(Test),
      from: table(Test),
      where: between(field(Test, 'value'), 3, 5),
      orderBy: field(Test, 'value'),
    };
    const client = getClient(adapter);
    const results = await client.select(sql);
    expect(results).toEqual([{ value: 4 }]);
  }));
});
