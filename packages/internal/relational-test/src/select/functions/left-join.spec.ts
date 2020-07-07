import { testAdapter } from '../../adapters';
import { alias, equal, field, getClient, leftJoin, SelectSql, table } from '@daita/relational';
import { seed } from '../../seed';

describe('left-join', () => {
  class Test {
    id!: string;
    value!: string;
  }

  beforeAll(async () => {
    await seed(
      Test,
      [
        { name: 'id', primaryKey: true, type: 'string', notNull: false },
        { name: 'value', primaryKey: false, type: 'string', notNull: false },
      ],
      [{ id: 'a', value: 'b' }, { id: 'b', value: 'c' }, { id: 'c', value: null }],
    );
  });

  describe('should select with join', testAdapter(async (adapter) => {
    const sql: SelectSql<any> = {
      select: {
        id: field(Test, 'id'),
        val: field(Test, 'value'),
        joinedVal: field(alias(Test, 'j'), 'value'),
      },
      from: table(Test),
      join: [leftJoin(alias(Test, 'j'), equal(field(Test, 'value'), field(alias(Test, 'j'), 'id')))],
      where: equal(field(Test, 'id'), 'c'),
    };
    const client = getClient(adapter);
    const results = await client.select(sql);
    expect(results).toEqual([{ id: 'c', val: null, joinedVal: null }]);
  }));
});
