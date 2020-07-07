import { testAdapter } from '../../adapters';
import { all, equal, field, getClient, or, SelectSql, table } from '@daita/relational';
import { seed } from '../../seed';

describe('equal', () => {
  class Test {
    value!: string;
  }

  beforeAll(async() => {
    await seed(
      Test,
      [{name: 'value', primaryKey: true, type: 'string', notNull: false}],
      [{ value: 'test' }, { value: 'foo' }, { value: 'bar' }]
    );
  });

  describe('should select with equal condition', testAdapter(async (adapter) => {
    const sql: SelectSql<any> = {
      select: all(Test),
      from: table(Test),
      where: equal(field(Test, 'value'), 'test'),
    };
    const client = getClient(adapter);
    const results = await client.select(sql);
    expect(results).toEqual([{value: 'test'}]);
  }));
});
