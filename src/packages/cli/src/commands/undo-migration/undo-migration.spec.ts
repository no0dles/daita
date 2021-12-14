import { undoMigration } from './undo-migration';
import { addMigration } from '../add-migration/add-migration';
import { setupEnv } from '@daita/testing';

describe('cli/commands/migration-undo', () => {
  it(
    `should undo migration`,
    setupEnv(
      'undo-migration',
      async (ctx) => {
        await ctx.linkNodeModules();
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
        await ctx.linkNodeModules();
        await addMigration('init', { cwd: ctx.cwd });
        await undoMigration({ cwd: ctx.cwd });
        await ctx.exists('src/migrations');
      },
      { schema: 'auth-schema' },
    ),
  );
});
