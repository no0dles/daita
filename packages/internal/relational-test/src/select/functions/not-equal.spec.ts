import { testAdapter } from '../../adapters';
import { all, field, getClient, notEqual, SelectSql, table } from '@daita/relational';
import { seed } from '../../seed';

describe('not-equal', () => {
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

  describe('should select with not equal condition', testAdapter(async (adapter) => {
    const sql: SelectSql<any> = {
      select: all(Test),
      from: table(Test),
      where: notEqual(field(Test, 'value'), 'test'),
      orderBy: field(Test, 'value'),
    };
    const client = getClient(adapter);
    const results = await client.select(sql);
    expect(results).toEqual([{value: 'bar'}, {value: 'foo'}]);
  }));
});
