import { testAdapter } from '../../adapters';
import { all, getClient, SelectSql, table } from '@daita/relational';
import { seed } from '../../seed';

describe('all', () => {
  class Test {
    value!: string;
  }

  beforeAll(async () => {
    await seed(
      Test,
      [{ name: 'value', primaryKey: true, type: 'string', notNull: false }],
      [{ value: 'test' }],
    );
  });

  describe('should select all from table', testAdapter(async (adapter) => {
    const sql: SelectSql<any> = {
      select: all(Test),
      from: table(Test),
    };
    const client = getClient(adapter);
    const result = await client.selectFirst(sql);
    expect(result).toEqual({ value: 'test' });
  }));
});
