import { RelationalInsertBuilder } from './relational-insert-builder';
import { RelationalAdapterMock } from '../testing/relational-adapter-mock';
import { SqlTable } from '../sql/sql-table';
import { SqlInsert } from '../sql/insert';

export class User {
  id!: string;
  foo!: string;
  parentId?: string;
  parent?: User;

  static table = 'foo';
  static schema = 'public';
}

async function testInsert<T>(
  sqlTable: SqlTable,
  action: (builder: RelationalInsertBuilder<T>) => RelationalInsertBuilder<T>,
  expectedQuery: SqlInsert,
) {
  const relationalAdapter = new RelationalAdapterMock();
  relationalAdapter.expect(expectedQuery);

  const builder = new RelationalInsertBuilder<T>(relationalAdapter, {
    insert: sqlTable,
    values: [],
  });
  await action(builder);
}

describe('builder/relational-insert-builder', () => {
  it('should insert(User).value({foo: 1, bar: test})', async () => {
    await testInsert(
      User,
      (builder) => builder.value({ foo: 1, bar: 'test' }),
      {
        insert: { table: User.table, schema: User.schema },
        values: [{ foo: 1, bar: 'test' }],
      },
    );
  });

  it('should insert(User).values({foo: 1, bar: test})', async () => {
    await testInsert(
      User,
      (builder) => builder.values({ foo: 1, bar: 'test' }, { bar: 'test' }),
      {
        insert: { table: User.table, schema: User.schema },
        values: [{ foo: 1, bar: 'test' }, { bar: 'test' }],
      },
    );
  });
});
