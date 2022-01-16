import { field, table } from '@daita/relational';
import { createMigrationTree } from '@daita/orm';
import { cleanupTestContext, getContexts } from '../../../testing';

describe('packages/orm/migration/steps/relational-add-table', () => {
  const migrationTree = createMigrationTree([
    { kind: 'add_table', table: 'foo', schema: 'bar' },
    { kind: 'add_table_field', table: 'foo', schema: 'bar', fieldName: 'id', required: true, type: 'uuid' },
  ]);
  const ctx = getContexts(migrationTree);

  class TestTable {
    static schema = 'bar';
    static table = 'foo';
    id!: string;
  }

  afterAll(async () => cleanupTestContext(ctx));

  beforeAll(async () => {
    await ctx.migrate();
  });

  it('should add table', async () => {
    const res = await ctx.select({
      select: field(TestTable, 'id'),
      from: table(TestTable),
    });
    expect(res).toEqual([]);
  });
});
