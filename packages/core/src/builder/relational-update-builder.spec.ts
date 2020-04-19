import { SqlTable } from '../sql/sql-table';
import { RelationalAdapterMock } from '../testing/relational-adapter-mock';
import { User } from './relational-insert-builder.spec';
import { RelationalUpdateBuilder } from './relational-update-builder';
import { SqlUpdate } from '../sql/update';
import { isSqlUpdate } from '../sql/update/sql-update';

async function testUpdate<T>(
  sqlTable: SqlTable,
  action: (builder: RelationalUpdateBuilder<T>) => RelationalUpdateBuilder<T>,
  expectedQueryOrError: SqlUpdate | Error,
) {
  const relationalAdapter = new RelationalAdapterMock();
  const builder = new RelationalUpdateBuilder<T>(relationalAdapter, {
    update: sqlTable,
    set: {},
  });

  if (isSqlUpdate(expectedQueryOrError)) {
    relationalAdapter.expect(expectedQueryOrError);
    await action(builder);
  } else {
    await expect(() => action(builder)).toThrowError(expectedQueryOrError);
  }
}

describe('builder/relational-update-builder', () => {
  it('should update({table: User}).set({foo: 1, bar: test})', async () => {
    await testUpdate(
      { table: 'User' },
      (builder) => builder.set({ foo: 1, bar: 'test' }),
      {
        update: { table: 'User' },
        set: { foo: 1, bar: 'test' },
      },
    );
  });

  it('should update({table: User}).set({foo: 1, bar: test}).where({foo: 2})', async () => {
    await testUpdate(
      { table: 'User' },
      (builder) => builder.set({ foo: 1, bar: 'test' }).where({ foo: 2 }),
      {
        update: { table: 'User' },
        set: { foo: 1, bar: 'test' },
        where: { left: { field: 'foo' }, operand: '=', right: 2 },
      },
    );
  });

  it('should not allow update({table: User}).set({foo: 1, bar: test}).where({parent:{foo: 2}})', async () => {
    await testUpdate(
      { table: 'User' },
      (builder) =>
        builder.set({ foo: 1, bar: 'test' }).where({ parent: { foo: 2 } }),
      new Error('not supported yet'),
    );
  });
});
