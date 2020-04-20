import { SqlTable } from '../sql/sql-table';
import { RelationalAdapterMock } from '../testing/relational-adapter-mock';
import { RelationalSelectBuilder } from './relational-select-builder';
import { SqlSelect } from '../sql/select';
import { isSqlSelect } from '../sql/select/sql-select';

async function testSelect<T = any>(
  sqlTable: SqlTable,
  action: (builder: RelationalSelectBuilder<T>) => RelationalSelectBuilder<T>,
  expectedQueryOrError: SqlSelect | Error,
) {
  const relationalAdapter = new RelationalAdapterMock();
  const builder = new RelationalSelectBuilder<T>(relationalAdapter, {
    select: [],
    from: sqlTable,
  });

  if (isSqlSelect(expectedQueryOrError)) {
    relationalAdapter.expect(expectedQueryOrError);
    await action(builder);
  } else {
    await expect(() => action(builder)).toThrowError(expectedQueryOrError);
  }
}

describe('builder/relational-select-builder', () => {
  it('should select({table: User})', async () => {
    await testSelect({ table: 'User' }, (builder) => builder, {
      select: [{ table: 'User', all: true }],
      from: { table: 'User' },
    });
  });

  it('should select({table: User}).limit(1)', async () => {
    await testSelect({ table: 'User' }, (builder) => builder.limit(1), {
      select: [{ table: 'User', all: true }],
      from: { table: 'User' },
      limit: 1,
    });
  });

  it('should select({table: User}).skip(1)', async () => {
    await testSelect({ table: 'User' }, (builder) => builder.skip(1), {
      select: [{ table: 'User', all: true }],
      from: { table: 'User' },
      offset: 1,
    });
  });

  it('should select({table: User}).join({table: User}, parent, on.eq(parentId, id))', async () => {
    await testSelect(
      { table: 'User' },
      (builder) =>
        builder.join({ table: 'User' }, 'parent', (on) =>
          on.eq(
            (u) => u.parentId,
            (p) => p.parent.id,
          ),
        ),
      {
        select: [
          { table: 'User', all: true },
          { table: 'parent', all: true },
        ],
        from: { table: 'User' },
        joins: [
          {
            from: { table: 'User', alias: 'parent' },
            type: 'inner',
            on: {
              left: { field: 'parentId', table: 'User' },
              operand: '=',
              right: { field: 'id', table: 'parent' },
            },
          },
        ],
      },
    );
  });
});
