import { testContext } from '../../../testing/relational/adapters';
import { MigrationTree } from '../../orm/migration/migration-tree';

describe('http-server/routes/orm', () => {
  it('should apply migrations', async () => {
    const migrationTree = new MigrationTree('test', [
      {
        id: 'first',
        steps: [
          { kind: 'add_table', table: 'Test' },
          { kind: 'add_table_field', fieldName: 'id', required: true, table: 'Test', type: 'string' },
        ],
      },
    ]);
    const ctx = testContext(migrationTree, 'http-sqlite', { user: { roles: ['daita:migration:admin'] } });
    await ctx.migrate();
  });
});
