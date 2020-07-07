import { testAdapter } from '../../adapters';
import { alias, field, getClient, SelectSql, table } from '@daita/relational';
import { seed } from '../../seed';

describe('alias', () => {
  class Test {
    value!: string;
  }

  beforeAll(async() => {
    await seed(
      Test,
      [{name: 'value', primaryKey: true, type: 'string', notNull: false}],
      [{ value: 'test' }]
    );
  });

  describe('should select value from table alias', testAdapter(async (adapter) => {
    const sql: SelectSql<any> = {
      select: {
        value: field(alias(Test, 't'), 'value'),
      },
      from: alias(Test, 't')
    };
    const client = getClient(adapter);
    const result = await client.selectFirst(sql);
    expect(result).toEqual({ value: 'test' });
  }));
});
