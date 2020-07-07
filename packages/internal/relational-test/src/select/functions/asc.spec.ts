import { testAdapter } from '../../adapters';
import { asc, field, getClient, SelectSql, table } from '@daita/relational';
import { seed } from '../../seed';

describe('asc', () => {
  class Test {
    value!: string;
  }

  beforeAll(async () => {
    await seed(
      Test,
      [{ name: 'value', primaryKey: true, type: 'string', notNull: false }],
      [{ value: 'foo' }, { value: 'bar' }],
    );
  });

  describe('should select order by asc', testAdapter(async (adapter) => {
    const sql: SelectSql<any> = {
      select: field(Test, 'value'),
      from: table(Test),
      orderBy: asc(field(Test, 'value')),
    };
    const client = getClient(adapter);
    const results = await client.select(sql);
    expect(results).toEqual(['bar', 'foo']);
  }));
});
