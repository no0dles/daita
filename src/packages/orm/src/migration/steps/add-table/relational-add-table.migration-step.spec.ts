import { testContext } from '@daita/relational';
import { createMigrationTree } from '../../create-migration-tree';
import { field, table } from '@daita/relational';

describe('packages/orm/migration/steps/relational-add-table', () => {
  const schema = createMigrationTree([
    { kind: 'add_table', table: 'foo', schema: 'bar' },
    { kind: 'add_table_field', table: 'foo', schema: 'bar', fieldName: 'id', required: true, type: 'uuid' },
  ]);
  class TestTable {
    static schema = 'bar';
    static table = 'foo';
    id!: string;
  }
  const ctxs = testContext(schema, ['pg', 'sqlite', 'mariadb']);

  describe.each(ctxs)('%s', (ctx) => {
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
});
