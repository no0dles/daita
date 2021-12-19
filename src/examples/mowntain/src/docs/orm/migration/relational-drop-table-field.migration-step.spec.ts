import { table } from '@daita/relational';
import { all } from '@daita/relational';
import { MigrationTree } from '@daita/orm';
import { getContexts } from '../../../testing';

describe('packages/orm/migration/steps/add-table-field', () => {
  const migrationTree = new MigrationTree('test', [
    {
      id: 'init',
      steps: [
        { kind: 'add_table', table: 'foo' },
        { kind: 'add_table_field', table: 'foo', fieldName: 'id', type: 'uuid', required: true },
        { kind: 'add_table_field', table: 'foo', fieldName: 'text', type: 'string', required: false },
        { kind: 'add_table_field', table: 'foo', fieldName: 'count', type: 'number', required: false },
      ],
    },
    {
      id: 'second',
      steps: [{ kind: 'drop_table_field', table: 'foo', fieldName: 'text' }],
      after: 'init',
    },
  ]);
  const ctxs = getContexts(migrationTree);

  describe.each(ctxs)('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.setup({ migrate: false, seed: false });
    });

    afterAll(async () => ctx.close());

    it('should be keep data after table field drop', async () => {
      await ctx.migrate({ targetMigration: 'init' });
      await ctx.insert({
        into: table('foo'),
        insert: {
          id: '23ad96bf-8eec-450d-97f5-ece30acbf356',
          text: 'test',
          count: 2,
        },
      });
      await ctx.migrate({ targetMigration: 'second' });
      const row = await ctx.selectFirst({
        select: all(),
        from: table('foo'),
      });
      expect(row).not.toBeNull();
      expect(row).not.toBeUndefined();
      expect(row.id).toEqual('23ad96bf-8eec-450d-97f5-ece30acbf356');
      expect(row.text).toBeUndefined();
      expect(row.count).toEqual(2);
    });
  });
});
