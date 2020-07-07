import { testAdapter } from '../../adapters';
import { all, equal, field, getClient, or, SelectSql, table } from '@daita/relational';
import { seed } from '../../seed';

describe('or', () => {
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

  describe('should select with or condition', testAdapter(async (adapter) => {
    const sql: SelectSql<any> = {
      select: all(Test),
      from: table(Test),
      where: or(
        equal(field(Test, 'value'), 'test'),
        equal(field(Test, 'value'), 'foo')
      ),
      orderBy: field(Test, 'value'),
    };
    const client = getClient(adapter);
    const results = await client.select(sql);
    expect(results).toEqual([{ value: 'foo' }, {value: 'test'}]);
  }));
});
