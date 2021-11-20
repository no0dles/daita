import { setupEnv } from '@daita/testing';
import { undoMigration } from './undo-migration';
import { addMigration } from '../add-migration/add-migration';

describe('cli/commands/migration-undo', () => {
  it(
    `should undo migration`,
    setupEnv(
      'undo-migration',
      async (ctx) => {
        await undoMigration({ cwd: ctx.cwd });
        await ctx.exists('src/migrations');
        await ctx.contains('src/migrations', ['202016152817-init.ts']);
      },
      { schema: 'auth-schema-migrated' },
    ),
  );

  it(
    `should add and undo migration`,
    setupEnv(
      'add-undo-migration',
      async (ctx) => {
        await addMigration('init', { cwd: ctx.cwd });
        await undoMigration({ cwd: ctx.cwd });
        await ctx.exists('src/migrations');
      },
      { schema: 'auth-schema' },
    ),
  );
});
