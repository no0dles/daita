import { field, RelationalAdapter, table } from '@daita/relational';
import { createMigrationTree, migrate, RelationalOrmAdapter } from '@daita/orm';
import { getTestAdapter } from '../../../testing';

describe('packages/orm/migration/steps/relational-add-table', () => {
  const migrationTree = createMigrationTree([
    { kind: 'add_table', table: 'foo', schema: 'bar' },
    { kind: 'add_table_field', table: 'foo', schema: 'bar', fieldName: 'id', required: true, type: 'uuid' },
  ]);

  class TestTable {
    static schema = 'bar';
    static table = 'foo';
    id!: string;
  }

  let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

  beforeAll(async () => {
    ctx = await getTestAdapter();
    await migrate(ctx, migrationTree);
  });

  afterAll(async () => ctx.close());

  it('should add table', async () => {
    const res = await ctx.select({
      select: field(TestTable, 'id'),
      from: table(TestTable),
    });
    expect(res).toEqual([]);
  });
});
