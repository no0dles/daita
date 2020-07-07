import { testAdapter } from '../../adapters';
import { field, getClient, isIn, SelectSql, table } from '@daita/relational';
import { seed } from '../../seed';

describe('in', () => {
  class Test {
    value!: number;
  }

  beforeAll(async () => {
    await seed(
      Test,
      [{ name: 'value', primaryKey: true, type: 'number', notNull: false }],
      [{ value: 1 }, { value: 11 }, { value: 22 }],
    );
  });

  describe('should select with where isIn', testAdapter(async (adapter) => {
    const sql: SelectSql<any> = {
      select: field(Test, 'value'),
      from: table(Test),
      where: isIn(field(Test, 'value'), [11, 22]),
    };
    const client = getClient(adapter);
    const results = await client.select(sql);
    expect(results).toEqual([11,22]);
  }));
});
