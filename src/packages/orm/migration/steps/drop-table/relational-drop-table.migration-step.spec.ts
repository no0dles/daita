import { testContext } from '../../../../../testing/relational/adapters';
import { MigrationTree } from '../../migration-tree';
import { all } from '../../../../relational/sql/keyword/all/all';
import { table } from '../../../../relational';
import { RelationDoesNotExistsError } from '../../../../relational/error/relational-error';

describe('packages/orm/migration/steps/drop-table', () => {
  const schema = new MigrationTree('', [
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
  const ctxs = testContext(schema, ['pg', 'sqlite', 'mariadb']);
  describe.each(ctxs)('%s', (ctx) => {
    beforeAll(async () => {
      await ctx.migrate();
    });

    it('should drop table', async () => {
      try {
        await ctx.select({ select: all(), from: table('foo') });
      } catch (e) {
        expect(e).toBeInstanceOf(RelationDoesNotExistsError);
      }
    });
  });
});
