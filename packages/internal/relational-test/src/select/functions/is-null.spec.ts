import { testAdapter } from '../../adapters';
import { field, getClient, isNull, SelectSql, table } from '@daita/relational';
import { seed } from '../../seed';

describe('is-null', () => {
  class Test {
    value!: number;
  }

  beforeAll(async () => {
    await seed(
      Test,
      [{ name: 'value', primaryKey: false, type: 'number', notNull: false }],
      [{ value: 1 }, { value: null }, { value: 22 }],
    );
  });

  describe('should select with where isNull', testAdapter(async (adapter) => {
    const sql: SelectSql<any> = {
      select: field(Test, 'value'),
      from: table(Test),
      where: isNull(field(Test, 'value')),
    };
    const client = getClient(adapter);
    const results = await client.select(sql);
    expect(results).toEqual([null]);
  }));
});
