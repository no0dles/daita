import { all } from '@daita/relational';
import { table } from '@daita/relational';
import { RelationDoesNotExistsError } from '@daita/relational';
import { migrate, MigrationTree } from '@daita/orm';
import { cleanupTestContext, getContexts } from '../../../testing';

describe('packages/orm/migration/steps/drop-table', () => {
  const migrationTree = new MigrationTree('', [
    {
      id: 'init',
      steps: [
        { kind: 'add_table', table: 'foo' },
        { kind: 'add_table_field', table: 'foo', fieldName: 'id', required: true, type: 'uuid' },
        { kind: 'add_table', table: 'bar' },
        { kind: 'add_table_field', table: 'bar', fieldName: 'id', required: true, type: 'uuid' },
        { kind: 'drop_table', table: 'foo' },
      ],
    },
    {
      id: 'second',
      steps: [{ kind: 'drop_table', table: 'bar' }],
      after: 'init',
    },
  ]);
  const ctx = getContexts();

  beforeAll(async () => {
    await migrate(ctx, migrationTree);
  });

  afterAll(async () => cleanupTestContext(ctx));

  it('should drop table', async () => {
    try {
      await ctx.select({ select: all(), from: table('foo') });
    } catch (e) {
      expect(e).toBeInstanceOf(RelationDoesNotExistsError);
    }
  });
});
