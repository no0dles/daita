import { testContext } from '../../../testing/relational/adapters';
import { MigrationTree } from '../../orm/migration/migration-tree';

describe('http-server/routes/orm', () => {
  it('should apply migrations', async () => {
    const migrationTree = new MigrationTree('test', [{ id: 'first', steps: [{ kind: 'add_table', table: 'Test' }] }]);
    const ctx = testContext(migrationTree, 'http-sqlite', { user: { roles: ['daita:migration:admin'] } });
    await ctx.migrate();
  });
});
